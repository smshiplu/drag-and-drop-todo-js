import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { loadingFull, toastMessage } from "./helper";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 
export const todosRef = collection(db, "todos");


export const getAllTask = async (uid) => {
  loadingFull(true);
  const queryTodoList = query(todosRef, where("uid", "==", uid), orderBy("createdAt", "desc"));
  const todoList = [];
  await getDocs(queryTodoList)
    .then( data => {
      data.docs.forEach(todo => {
        todoList.push({...todo.data(), id: todo.id});
      });
      loadingFull(false);
    })
    .catch( error => {
      loadingFull(false);
      toastMessage(error.message, "error");
    })
  return todoList;
}

export const getTaskByColId = async (uid, colId) => {
  loadingFull(true);
  const queryTodoList = query(todosRef, where("uid", "==", uid), where("columnId", "==", colId));
  const todoList = [];
  await getDocs(queryTodoList)
    .then( data => {
      data.docs.forEach(todo => {
        todoList.push({...todo.data(), id: todo.id});
      });
      loadingFull(false);
    })
    .catch( error => {
      loadingFull(false);
      toastMessage(error, "error");
    })
  return todoList;
}

export const addTask = async (formData) => {
  loadingFull(true);
  await addDoc(todosRef, {...formData})
    .then(() => {
      loadingFull(false);
      toastMessage("Added successfully", "success");
    })
    .catch(error => {
      loadingFull(false);
      toastMessage(error.message, "error");
    })
}

export const updateTodoByColumnId = async (id, colId) => {
  loadingFull(true);
  const docRef = doc(db, "todos", id);
  updateDoc(docRef, {
    columnId: colId,
    updatedAt: serverTimestamp()
  })
  .then(() => {
    loadingFull(false);
    toastMessage("Bookmark updated", "success");
  })
  .catch(error => {
    loadingFull(false);
    console.log(error);
    
    toastMessage(error, "error");
  })
}

export const  updateTask = async (id, updatedInfo) => {
  loadingFull(true);
  const docRef = doc(db, "todos", id);
  updateDoc(docRef, updatedInfo)
  .then(() => {
    loadingFull(false);
    toastMessage("Bookmark updated", "success");
  })
  .catch(error => {
    loadingFull(false);
    toastMessage(error, "error");
  })
}

export const deleteTask = async (id) => {
  loadingFull(true);
  const docRef = doc(db, "todos", id);
  await deleteDoc(docRef)
  .then(() => {
    loadingFull(false);
    toastMessage("Bookmark deleted", "success");
  })
  .catch(error => {
    loadingFull(false);
    toastMessage(error, "error");
  })
}

