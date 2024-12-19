import Toastify from "toastify-js";

export const toggleUserMenu = (elem, user) => {
  elem.firstElementChild.textContent = user.email
  if(elem.classList.contains("invisible")) {
    elem.classList.remove("invisible");
    elem.classList.add("visible");
  } else {
    elem.classList.remove("visible");
    elem.classList.add("invisible");
  }
}

export const handleDarkMode = (htmlCollection) => {
  const storageValue = JSON.parse(localStorage.getItem("drag-and-drop-todo-dark-mode"));
  let darkModeToggle = storageValue != null || storageValue != "undefined" ? storageValue : false;
  
  if(darkModeToggle) {
    if(!document.querySelector("html").classList.contains("dark")) {
      document.querySelector("html").classList.add("dark");
    }
  } else {
    document.querySelector("html").classList.remove("dark");
  }
  htmlCollection.forEach( item => {
    item.addEventListener("click", e => {
      darkModeToggle = !darkModeToggle;
      if(darkModeToggle) {
        document.querySelector("html").classList.add("dark");
        localStorage.setItem("drag-and-drop-todo-dark-mode", JSON.stringify(true));
      } else {
        document.querySelector("html").classList.remove("dark");
        localStorage.setItem("drag-and-drop-todo-dark-mode", JSON.stringify(false));
      }
    });
  });
}

export const loadingFull = (boolean) => {
  const divElement = document.createElement("div");
  divElement.className += "loading-full overlay fixed w-full h-full top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-50";
  if(boolean) {
    const innerDiv = document.createElement("div");
    innerDiv.className =+ "bg-white max-w-32 w-full";

    innerDiv.innerHTML =`<svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg><span class="sr-only">Loading...</span>`;

    divElement.appendChild(innerDiv);
    document.querySelector("body").appendChild(divElement);
  } else {
    const loadingFull = document.querySelector(".loading-full");
    loadingFull && loadingFull.remove();
  }

}

export const toastMessage = (message, type) => {
  Toastify({
    text: message,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    className: `${type === "success" ? "text-green-600" : type === "error" ? "text-rose-600" : type === "warning" ? "text-orange-600" : "text-gray-500"} fixed flex items-center justify-between w-full max-w-sm p-4 space-x-4 bg-gray-50 divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow left-1/2 -translate-x-1/2 transition-translate   dark:divide-gray-700 dark:bg-gray-800 text-sm font-normal z-40`,
    offset: {
      x: "50%",
      y: 10
    }
  }).showToast();
}

export const addTaskCardToDom = (arr, elem) => {
  elem.innerHTML = "";
  arr.length > 0 && arr.forEach((task) => {
    elem.innerHTML += generateTemplate(task);
  });
}

export const moveToTooltip = (btn, htmlCollection) => {
  htmlCollection.forEach((tooltip) => {
    if(btn.nextElementSibling !== tooltip) {
      tooltip.classList.remove("visible");
      tooltip.classList.add("invisible");
    }
  });
  if(btn.nextElementSibling.classList.contains("invisible")) {
    btn.nextElementSibling.classList.remove("invisible");
    btn.nextElementSibling.classList.add("visible");
  } else {
    btn.nextElementSibling.classList.remove("visible");
    btn.nextElementSibling.classList.add("invisible");
  }
}

export const editBtnToggle = (btn) => {
  if(btn.classList.contains("editEnable")) {
    btn.classList.add("invisible");
    btn.nextElementSibling.classList.remove("invisible");
    btn.nextElementSibling.classList.add("visible");
  }
  if(btn.classList.contains("editConfirm")) {
    btn.classList.add("invisible");
    btn.previousElementSibling.classList.remove("invisible");
    btn.previousElementSibling.classList.add("visible");
  }
}

export const generateTemplate = (task) => {
  //Convert firebase serverTimestamp to Javascript Date Time 
  const createdAtTimestamp = task.createdAt ? (task.createdAt.seconds + task.createdAt.nanoseconds * 10 ** -9) * 1000 : new Date().toLocaleDateString();
  const updatedAtTimestamp = task.updatedAt ? (task.updatedAt.seconds + task.updatedAt.nanoseconds * 10 ** -9) * 1000 : new Date().toLocaleDateString();
  
  const createdAt = new Date(createdAtTimestamp).toLocaleDateString();
  const updatedAt = new Date(updatedAtTimestamp).toLocaleDateString();

  return `<div draggable="true" class="card dark:shadow-white bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border shadow-sm p-1.5 my-4 rounded" data-id="${[task.id, task.columnId]}">
    <input data-id="${task.id}" type="text" class="titleInput text-gray-900 text-sm font-semibold rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-1 py-2 dark:bg-gray-800 dark:border-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 line-clamp-1" autocomplete="off" value="${task.title}" maxlength="" disabled required>
    <div class="flex items-center justify-between mt-3">
      <span class="inline-block text-[10px] italic">${createdAtTimestamp == updatedAtTimestamp ? "Created At: " + createdAt : "Updated At: " + updatedAt}</span>
      <div class="actionBtns relative flex items-end justify-between gap-1">
        <div class="moveTask relative flex items-center">
          <button class="moveTaskToggleBtn"  type="button">
            <svg class="w-5 h-5 text-sky-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 20V7m0 13-4-4m4 4 4-4m4-12v13m0-13 4 4m-4-4-4 4"/>
            </svg>
          </button>
          <div class="tooltip invisible w-28 absolute -top-2.5 -translate-y-full left-1/2 -translate-x-1/2 z-10 inline-block p-1 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-100 dark:bg-gray-600 ">
            <div class="moveOption">
              <input data-id="${task.id}" class="moveTo cursor-pointer w-full p-2 text-sm font-medium text-white focus:outline-none bg-blue-800 rounded-tl-lg rounded-tr-lg border border-gray-200 hover:bg-blue-900 hover:text-white focus:z-10 focus:ring-1 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button" value="${task.columnId == 0 ? "Ongoing" : `${task.columnId == 1 ? "Pending" : `${task.columnId == 2 ? "Ongoing" : ""}` }` }">
              <input data-id="${task.id}" class="moveTo cursor-pointer w-full p-2 text-sm font-medium text-white focus:outline-none bg-blue-800 rounded-bl-lg rounded-br-lg border border-gray-200 hover:bg-blue-900 hover:text-white focus:z-10 focus:ring-1 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button" value="${task.columnId == 0 ? "Completed" : `${task.columnId == 1 ? "Completed" : `${task.columnId == 2 ? "Pending" : ""}` }` }">
            </div>
            <div class="tooltip-arrow w-full relative">
              <svg class="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-6 text-gray-900 dark:text-gray-600 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="editToggle flex items-center">
          <button class="editBtn editEnable absolute top-0 -left-6"  type="button">
            <svg class="w-5 h-5 text-blue-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
            </svg>
          </button>
          <button data-id="${task.id}" class="editBtn editConfirm absolute top-0 -left-6 invisible"  type="submit">
            <svg class="w-5 h-5 text-green-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5"/>
            </svg>
          </button>
        </div>
        <button class="deleteBtn" data-id="${[task.id, task.columnId]}" type="button" >
          <svg class="w-5 h-5 text-rose-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
          </svg>
        </button>                      
      </div>
    </div>
  </div>`
}

