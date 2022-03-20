const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemsList = document.querySelector("#itemsList");
const filters = document.querySelectorAll(".nav-item");
const alertDiv = document.querySelector("#message");

//create an empty item list
let todoItems =[];

const setLocalStorage = function(todoItems){
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

const getLocalStorage = function(){
  const todoStorage = localStorage.getItem("todoItems");
  if (todoStorage ==="undefined" || todoStorage === null){
    todoItems=[];
  }
  else{
    todoItems = JSON.parse(todoStorage);
  }

  console.log("items", todoItems);
  getList(todoItems);
}

const getList = function(todoItems){
  itemsList.innerHTML ="";
  if(todoItems.length >0){
    // we have task to add into the list
    todoItems.forEach((item) =>{

      const iconClass = item.isDone
      ? "bi-calendar-check-fill"
      : "bi-calendar-check";

      const iconClassD = item.isDeleted
      ? "bi-calendar-x-fill"
      : "bi-calendar-x";

      let liTag=`
      <li class="list-group-item d-flex justify-content-between align-items-center">              
      <span class="title" data-time=${item.addedAt}>${item.name}</span>      
          <span>
            <a href="#" data-done><i class="bi ${iconClass}  green"></i></a>
            <a href="#" data-edit><i class="bi bi-pencil-square blue"></i></a>
            <a href="#" data-delete><i class="bi ${iconClassD} red"></i></a>
          </span>
        </li>`;
      itemsList.insertAdjacentHTML("beforeend",liTag);
      handleItem(item);

    });
  }
  else{
    let liTag = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
               <span>No Records Found.</span>
        </li>`;
    itemsList.insertAdjacentHTML("beforeend", liTag);
  }
}

const removeItem = function (item) {
  const removeIndex = todoItems.indexOf(item);
  todoItems.splice(removeIndex, 1);
}

const alertMessage = function (message, className) {
  alertDiv.innerHTML = message;
  alertDiv.classList.add(className, "show");
  alertDiv.classList.remove("hide");
  setTimeout(() => {
    alertDiv.classList.add("hide");
    alertDiv.classList.remove("show");
  }, 3000)
}

const updateItem = function (currentItemIndex, value) {
  const newItem = todoItems[currentItemIndex];
  newItem.name = value;
  todoItems.splice(currentItemIndex, 1, newItem);
  setLocalStorage(todoItems);
}

const getItemsFilter = function (type) {
  let filterItems = [];
  switch (type) {
    case "deleted":
      filterItems = todoItems.filter((item) => item.isDeleted);
      break;
    case "todo":
      filterItems = todoItems.filter((item) => !item.isDone && !item.isDeleted);
      break;
    case "done":
      filterItems = todoItems.filter((item) => item.isDone && !item.isDeleted);
      break;
    default:
      filterItems = todoItems.filter((item) => !item.isDeleted);;
  }
  getList(filterItems);
}

const handleItem = function(itemData){
  const items = document.querySelectorAll(".list-group-item");
  items.forEach((item) =>{
    //done 我抓取的item產生時間與所對應的產生時間相同
    if (item.querySelector(".title").getAttribute('data-time') == itemData.addedAt){
      item.querySelector('[data-done]').addEventListener('click', function(e){
        e.preventDefault();

        const itemIndex = todoItems.indexOf(itemData);
        const currentItem = todoItems[itemIndex];

        //符號變色
        const currentClass = currentItem.isDone
        ? "bi-calendar-check-fill"
        : "bi-calendar-check";


        currentItem.isDone = currentItem.isDone ? false : true;
        //把選定的 item 先分別出來,接著更新在 localStorage 的資料
        todoItems.splice(itemIndex, 1, currentItem);
        setLocalStorage(todoItems);

        //設定 icon 的變化
        const iconClass = currentItem.isDone
        ? "bi-calendar-check-fill"
        : "bi-ccalendar-check";
        this.firstElementChild.classList.replace(currentClass, iconClass);

        //切換 tab
        const filterType = document.querySelector("#tabValue").value;
        getItemsFilter(filterType);
      });

      //edit
      item.querySelector("[data-edit]").addEventListener("click", function (e) {
        e.preventDefault();
        itemInput.value = itemData.name;
        document.querySelector("#objIndex").value = todoItems.indexOf(itemData);
      });

      //delete  
      item.querySelector("[data-delete]").addEventListener("click", function (e) {
        e.preventDefault();
        const itemIndex = todoItems.indexOf(itemData);
        const currentItem = todoItems[itemIndex];

        if (currentItem.isDeleted){
          const currentClass = currentItem.isDeleted
          ? "bi-calendar-x-fill"
          : "bi-calendar-x";


          currentItem.isDeleted = currentItem.isDeleted ? false : true;
          //把選定的 item 先分別出來,接著更新在 localStorage 的資料
          todoItems.splice(itemIndex, 1, currentItem);
          setLocalStorage(todoItems);

          //設定 icon 的變化
          const iconClass = currentItem.isDeleted
          ? "bi-calendar-x-fill"
          : "bi-calendar-x";
          this.firstElementChild.classList.replace(currentClass, iconClass);

          //切換 tab
          const filterType = document.querySelector("#tabValue").value;
          getItemsFilter(filterType);
        }
        else{
          if (confirm("Are you sure you want to remove this item?")) {
            //符號變色
            const currentClass = currentItem.isDeleted
            ? "bi-calendar-x-fill"
            : "bi-calendar-x";


            currentItem.isDeleted = currentItem.isDeleted ? false : true;
            //把選定的 item 先分別出來,接著更新在 localStorage 的資料
            todoItems.splice(itemIndex, 1, currentItem);
            setLocalStorage(todoItems);

            //設定 icon 的變化
            const iconClass = currentItem.isDeleted
            ? "bi-calendar-x-fill"
            : "bi-calendar-x";
            this.firstElementChild.classList.replace(currentClass, iconClass);

            //切換 tab
            const filterType = document.querySelector("#tabValue").value;
            getItemsFilter(filterType);
            /*//刪除
            itemsList.removeChild(item);
            //到 storage 刪除並更新
            removeItem(item);
            setLocalStorage(todoItems);*/
            //提醒使用者
            alertMessage("Item has been deleted", "alert-success");                    
          }
        }
      });
    }    
  })  
};

document.addEventListener("DOMContentLoaded", () =>{
  filters.forEach((tab) => {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      const tabType = this.getAttribute("data-type");
      document.querySelectorAll(".nav-link").forEach((nav) => {
        nav.classList.remove("active");
      });
      this.firstElementChild.classList.add("active");
      getItemsFilter(tabType);
      document.querySelector("#tabValue").value = tabType;
    })
  })
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const itemName = itemInput.value.trim();
    //add task into the array
    //if user input nothing give him a hint
    if(itemName.length === 0){
      //alert("Please Enter a Task!");
      alertMessage("Please enter name", "alert-danger");
    }
    else{
      //create a task into the list
      //判斷是要修改 還是要新增
      const currentItemIndex = document.querySelector("#objIndex").value;
      if(currentItemIndex){
        //update
        updateItem(currentItemIndex, itemName);
        document.querySelector("#objIndex").value = "";
        alertMessage("Item has been updated", "alert-success");
      }
      else{ 
        const itemObj ={
          name: itemName,
          isDone: false,
          isDeleted: false,
          addedAt: new Date().getTime()
        };
        todoItems.push(itemObj);
        setLocalStorage(todoItems);
        //告知使用者
        alertMessage("New Item has been added", "alert-success");
      }
      getList(todoItems);
    }
    itemInput.value = ""; 
    getLocalStorage();
    console.log("getlocal");
    
    const filterType = document.querySelector("#tabValue").value;
    getItemsFilter(filterType);
    // end of task adding
  })
})