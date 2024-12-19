import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup} from "firebase/auth";
import { addTask, auth, deleteTask, todosRef, updateTask } from "./firebase";
import { onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { addTaskCardToDom, editBtnToggle, handleDarkMode, moveToTooltip, toggleUserMenu } from "./helper";

import "./style.css";
import LogoSvg  from "./images/logo.svg";
import FaviconPng from "./images/favicon.png";

const linkTag = document.querySelector("link");
const logoImg = document.querySelector(".logoImg");
const signInBtn = document.querySelector(".signInBtn");
const whenLoggedIn = document.querySelector(".whenLoggedIn");
const whenLoggedOut = document.querySelector(".whenLoggedOut");
const userMenuToggleBtn = document.querySelector(".userMenuToggleBtn");
const userMenu = document.querySelector(".userMenu");
const themeToggleBtns = document.querySelectorAll(".themeToggleBtn");
const logOutBtn = document.querySelector(".logOutBtn");
const addForms = document.querySelectorAll(".addForm");
const pendingTaskCount = document.querySelector(".pending .taskCount");
const ongoingTaskCount = document.querySelector(".ongoing .taskCount");
const completedTaskCount = document.querySelector(".completed .taskCount");
const pendingCards = document.querySelector(".pending .cards");
const ongoingCards = document.querySelector(".ongoing .cards");
const completedCards = document.querySelector(".completed .cards");

linkTag.href = FaviconPng;
const taskColumns = [pendingCards, ongoingCards, completedCards];
const provider = new GoogleAuthProvider();

onAuthStateChanged(auth, async user => {
  if(user) {
    // console.log("User logged in");

    whenLoggedIn.hidden = false;
    whenLoggedOut.hidden = true;
    logoImg.src = LogoSvg;
    handleDarkMode(themeToggleBtns);
    userMenuToggleBtn.addEventListener("click", e => {
      toggleUserMenu(userMenu, user);
    });
    logOutBtn.addEventListener("click", async e => {
      await auth.signOut()
      .then(() => {
        whenLoggedIn.hidden = true;
        whenLoggedOut.hidden = false;
        location.reload(true);
      })
      .catch(error => {
        console.log(error);
      })
    });
    
    const queryTodoList = query(todosRef, where("uid", "==", user.uid), orderBy("updatedAt", "asc"));
    onSnapshot(queryTodoList, data => {
      const todoList = [];
      data.docs.forEach(data => {
        todoList.push({...data.data(), id: data.id});
      });
      render(todoList);
      
      const moveTaskToggleBtn = document.querySelectorAll(".moveTaskToggleBtn");
      moveTaskToggleBtn.forEach(toggleBtn => {
        toggleBtn.addEventListener("click", e => {
          const tooltips = document.querySelectorAll(".tooltip");
          moveToTooltip(toggleBtn, tooltips);
        })
      });

      const moveToInput = document.querySelectorAll(".moveTo");
      moveToInput.forEach(inputBtn => {
        inputBtn.addEventListener("click", async e => {
          const moveTaskToColId = getColId(e.target.value);
          const task = todoList.filter(item => item.id == inputBtn.dataset.id)[0];
          const updatedTask = {
            columnId: moveTaskToColId !== "undefined" ? moveTaskToColId : task.columnId,
            updatedAt: serverTimestamp()
          }
          await updateTask(inputBtn.dataset.id, updatedTask);
        })
      });

      const editEnableBtns = document.querySelectorAll(".editBtn.editEnable");
      editEnableBtns.forEach((btn, idx1) => {
        btn.addEventListener("click", e => {
          editBtnToggle(btn);
          const titleInputs = document.querySelectorAll(".titleInput");
          titleInputs.forEach((input, idx2) => {
            if(idx1 == idx2) {
              input.disabled = false;
              input.focus();
            }
          })
        })
      });

      const editConfirmBtns = document.querySelectorAll(".editBtn.editConfirm");
      editConfirmBtns.forEach(btn => {
        btn.addEventListener("click", e => {
          editBtnToggle(btn);
          const titleInputs = document.querySelectorAll(".titleInput:not([disabled])");
          titleInputs.forEach(async (input) => {
            if(input.dataset.id == btn.dataset.id) {
              input.disabled = true;
              const task = todoList.filter(task => task.id == btn.dataset.id)[0];
              const updatedTask = {
                title: input?.value || task.title
              }
              await updateTask(btn.dataset.id, updatedTask);
            }
          })
        })
      });

      taskColumns.forEach((column, index) => {
        column.addEventListener("dragstart", e => {
          if(e.target.classList.contains("card")) {
            e.target.classList.add("dragging");
            e.target.classList.add("opacity-30");
          }
        });

        column.addEventListener("dragover", e => {
          const card = document.querySelector(".dragging");
          column.appendChild(card);
        });

        column.addEventListener("dragend", async e => {
          if(e.target.classList.contains("dragging")) {
            e.target.classList.remove("dragging");
            e.target.classList.remove("opacity-30");
            const targetColId = index;
            const taskId = e.target.dataset.id.split(",")[0];
            const taskColId = e.target.dataset.id.split(",")[1];
            const task = todoList.filter(task => task.id == taskId)[0];
            if(task && taskColId != targetColId) {
              const updatedTask = {
                columnId: targetColId,
                updatedAt: serverTimestamp()
              }
              await updateTask(taskId, updatedTask);
            }
            if(task && taskColId == task.columnId) {
              const updatedTask = {
                updatedAt: serverTimestamp()
              }
              await updateTask(taskId, updatedTask);
            }
          }
        })
      });

      const deleteBtns = document.querySelectorAll(".deleteBtn");
      deleteBtns.forEach(btn => {
        btn.addEventListener("click", async e => {
          const taskId = btn.dataset.id.split(",")[0]; 
          const colId = btn.dataset.id.split(",")[1];
          if(confirm("Are you sure to delete?")) {
            await deleteTask(taskId);
          }
        });
      });


      function getColId(val) {
        let colId = null;
        if(val == "Pending") {
          colId = 0;
        }
        else if(val == "Ongoing") {
          colId = 1;
        }
        else if(val == "Completed") {
          colId = 2;
        }
        else {}
        return colId;
      }

    });
    
    addForms.forEach((form, index) => {
      form.addEventListener("submit", async e => {
        e.preventDefault();
        try {
          const formData = {
            uid: user.uid,
            columnId: index,
            title: form.title.value,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
          await addTask(formData);
          form.reset();
        } catch (error) {
          console.log(error);
        }
      })
    });

    const render = (dataArray) => {
      const allPendingList = dataArray.filter(item => item.columnId == 0);
      addTaskCardToDom(allPendingList, pendingCards);
      pendingTaskCount.textContent = allPendingList.length;

      const allOngoingList = dataArray.filter(item => item.columnId == 1);
      addTaskCardToDom(allOngoingList, ongoingCards);
      ongoingTaskCount.textContent = allOngoingList.length;

      const allCompletedList = dataArray.filter(item => item.columnId == 2);
      addTaskCardToDom(allCompletedList, completedCards);
      completedTaskCount.textContent = allCompletedList.length;
    }

    
  } else { 
    // console.log("User not logged in");
    whenLoggedIn.hidden = true;
    whenLoggedOut.hidden = false;
    handleDarkMode(themeToggleBtns);
    signInBtn.addEventListener("click", async e => {
      await signInWithPopup(auth, provider)
      .then(() => {
        whenLoggedIn.hidden = false;
        whenLoggedOut.hidden = true;
        location.reload(true);
      })
      .catch(error => {
        console.log(error);
      })
    });
  }
})