
const tasksDOM = document.querySelector('.tasks')
const loadingDOM = document.querySelector('.loading-text')
const profileSection = document.querySelector('.dropdown-menu');
const formDOM = document.querySelector('.task-form')
const taskTitle = document.querySelector('.title')
const taskDescription = document.querySelector('.description');
const taskTag = document.querySelector('.tag');
const formAlertDOM = document.querySelector('.form-alert');
const profileName = document.querySelector('.profile-name');
const searchValue = document.querySelector('.search');
const search = document.querySelector('.search-btn');
const select = document.querySelector('.form-select');
const profilePic = document.querySelector('.profile-pic');
const optionsObject = document.getElementsByTagName('option');
// Load tasks from /api/tasks
const Task = document.getElementsByClassName('tasks')[0];



const fetchAllTags = async(tag) =>{
  select.innerHTML = `<option selected value="all">Sort By Tag Names</option>`;
    const {data} = await axios.get('/api/v1/tasks/task?tag=all');
  const tags = [];
    data.tags.map((tag,index)=>{
      if(!tags.includes(tag)){
        tags.push(tag);
      }
      
      
    });
    // console.log(tags);
    tags.map((tag)=>{
      const optionTag = `<option value=${tag}>${tag}</option>`;
      select.innerHTML +=  optionTag; 

    })
  
 
}
fetchAllTags();

const showTasks = async (option) => {
  loadingDOM.style.visibility = 'visible'
  try {
    if(option == "all"){
 
      const {
        data: { tasks,user },
      } = await axios.get('/api/v1/tasks/task');
      // console.log("request done");
      profileName.innerText = user.name;
      profilePic.src = "/" + user.profileImage;
      profileSection.innerHTML +=`
      <li><a class="dropdown-item edit-profile" href="edit-profile.html?id=${user._id}">Edit profile</a></li>
      `
      if (tasks.length < 1) {
        tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>'
        loadingDOM.style.visibility = 'hidden'
        return
      }
      const allTasks = tasks
        .map((task) => {
          const { completed, _id: taskID, title,description,tag } = task
          return `<div class="single-task ${completed && 'task-completed'}" ontouchstart="touchstart(event)"  ontouchend="touchend(event)">
  <h5 style="user-select: none;"><span><i class="far fa-check-circle"></i></span>${title}</h5>
  <p style="user-select: none;">${description}</p>
  <b style="user-select: none;">${tag}</b>
  <div class="task-links">
  <!-- edit link -->
  <a href="task.html?id=${taskID}"  class="edit-link">
  <i class="fas fa-edit"></i>
  </a>
  <!-- delete btn -->
  <button type="button" class="delete-btn" data-id="${taskID}">
  <i class="fas fa-trash"></i>
  </button>
  </div>
  </div>`
        })
        .join('')
      tasksDOM.innerHTML = allTasks
      // fetchAllTags();
     
    }
    else{
      const {
        data: { tasks,user },
      } = await axios.get(`/api/v1/tasks/task?tag=${option}`);
      // console.log("request done");
      profileName.innerText = user.name;
      profilePic.src = "/" + user.profileImage;
      profileSection.innerHTML +=`
      <li><a class="dropdown-item edit-profile" href="edit-profile.html?id=${user._id}">Edit profile</a></li>
      `
      if (tasks.length < 1) {
        tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>'
        loadingDOM.style.visibility = 'hidden'
        return
      }
      const allTasks = tasks
        .map((task) => {
          const { completed, _id: taskID, title,description,tag } = task
          return `<div class="single-task ${completed && 'task-completed'}" ontouchstart="touchstart(event)"  ontouchend="touchend(event)">
  <h5 style="user-select: none;"><span><i class="far fa-check-circle"></i></span>${title}</h5>
  <p style="user-select: none;">${description}</p>
  <b style="user-select: none;">${tag}</b>
  <div class="task-links">
  <!-- edit link -->
  <a href="task.html?id=${taskID}"  class="edit-link">
  <i class="fas fa-edit"></i>
  </a>
  <!-- delete btn -->
  <button type="button" class="delete-btn" data-id="${taskID}">
  <i class="fas fa-trash"></i>
  </button>
  </div>
  </div>`
        })
        .join('')
      tasksDOM.innerHTML = allTasks
      // fetchAllTags();
    }
   
  } catch (error) {
    const checkToken = async() => {
      let token;
      const cookie = document.cookie.split(';');
      cookie.map(item=>{
       const tokenNames = item.split('=');
       if(tokenNames[0].includes("TaskManagerToken")){
        token = tokenNames[1];
       }
      });
      select.style.display = "none";
      if (token) {
        const offlineTasks = JSON.parse(localStorage.getItem('offline-tasks'));
        const tasks = Object.values(offlineTasks);
        alert("you are offline, don't worry your tasks will get uploaded to db once you get back online");
       //  console.log(tasks);
             const allTasks =tasks
           .map((task,index) => {
             const { completed, id: taskID, title,description,tag } = task
             return `<div class="single-task ${completed && 'task-completed'}" ontouchstart="touchstart(event)"  ontouchend="touchend(event)">
     <h5 style="user-select: none;"><span><i class="far fa-check-circle"></i></span>${title}</h5>
     <p style="user-select: none;">${description}</p>
     <b style="user-select: none;">${tag}</b>
     <div class="task-links">
     <!-- edit link -->
     <a href="task.html?id=${taskID? taskID : "Offline_Task "+index}"  class="edit-link">
     <img src="./assets/edit.png" class="edit-icon" />

     </a>
     <!-- delete btn -->
     <button type="button" class="delete-btn" data-id="${taskID}">
     <img src="./assets/delete.png" class="delete-icon" />

     </button>
     </div>
     </div>`
           })
           .join('')
         tasksDOM.innerHTML = allTasks
        //  fetchAllTags();
     
      }
      else{
        window.location.href="/index.html"
      }
    }
    checkToken();
    
    
    
    //     const allTasks =tasks
    //       .map((task) => {
      //         const { completed, _id: taskID, title,description,tag } = task
      //         return `<div class="single-task ${completed && 'task-completed'}">
      // <h5><span><i class="far fa-check-circle"></i></span>${title}</h5>
      // <p>${description}</p>
      // <b>${tag}</b>
      // <div class="task-links">
      // <!-- edit link -->
      // <a href="task.html?id=${taskID}"  class="edit-link">
      // <i class="fas fa-edit"></i>
      // </a>
      // <!-- delete btn -->
      // <button type="button" class="delete-btn" data-id="${taskID}">
      // <i class="fas fa-trash"></i>
      // </button>
      // </div>
      // </div>`
      //       })
      //       .join('')
      //     tasksDOM.innerHTML = allTasks
      
      // window.location.href = "/index.html"
    }
    loadingDOM.style.visibility = 'hidden'
  }
  
  showTasks("all");
  
  //fetch all tags


  const uploadTasks = async() =>{
    try {
      let offlineTasks = JSON.parse(localStorage.getItem("offline-tasks"));
      let newOfflineTasks = offlineTasks.map((task)=>{
        const newTasks = axios.post('/api/v1/tasks/offline',task).then((res)=>{
          alert(res.data.msg);
          showTasks("all");
          return   offlineTasks.filter((item)=> {return Number(item.id) != res.data.task.offlineId});
        }).then((tasks)=>{
          if(tasks.length<=1){
            localStorage.removeItem("offline-tasks");
            
    }else{

      localStorage.setItem("offline-tasks",tasks);
    }
    
  });
 
})
} catch (error) {
    console.log(error)
  }


};

setInterval(()=>{
  uploadTasks();

},5000)
async function deleteTask(e,element){
  let el;
  if(!element){
  el = e.target;
  }else{
   el = element
  }


  if (el.parentElement.classList.contains('delete-btn')) {
    const id = el.parentElement.dataset.id
    try {
      await axios.delete(`/api/v1/tasks/task/${id}`);
      showTasks("all");
      fetchAllTags();
      loadingDOM.style.visibility = 'visible';

    } catch (error) {
       const offlinetasks = JSON.parse(localStorage.getItem('offline-tasks'));
       const newTasks = offlinetasks.filter(item=>{
         return Number(item.id) != Number(id);
       });
      //  console.log(newTasks);
       localStorage.setItem('offline-tasks',JSON.stringify(newTasks));
       showTasks();
    }
  }
  loadingDOM.style.visibility = 'hidden'
}

tasksDOM.addEventListener('click', deleteTask);

// form


formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const title = taskTitle.value; 
  const description = taskDescription.value; 
  const tag = taskTag.value; 
  try {
    const {user} = await axios.post('/api/v1/tasks/task', { title,description,tag });
    
    taskTitle.value = ''
    taskDescription.value = ''
    taskTag.value = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, task added`
    formAlertDOM.classList.add('text-success')
    localStorage.setItem('User',JSON.stringify(user));
    showTasks("all");
    fetchAllTags(tag);
  } catch (error) {
    let tasks;
      //completed, _id: taskID, title,description,tag
      const user = localStorage.getItem('User',localStorage.getItem('User'));
      const offlineTasksObject = JSON.parse(localStorage.getItem('offline-tasks'));
      // console.log(offlineTasksObject);
      if(!offlineTasksObject){
        let first = {
          tasks:[
          ]
          };
          tasks = {
            id:Math.random().toLocaleString(),
            completed:false,
            title:title,
            description:description,
            tag:tag,
            createdBy:user
          }
          const offlineTasks = Object.values(first)[0];
          // console.log(offlineTasks)
          offlineTasks.push(tasks);
          tasks = offlineTasks;
      }else{
      const offlineTasks = Object.values(offlineTasksObject);
      tasks = {
        id:Math.random().toLocaleString(),
        completed:false,
        title:title,
        description:description,
        tag:tag,
        createdBy:user
      }
      offlineTasks.push(tasks);
      tasks = offlineTasks;
    }
      localStorage.setItem('offline-tasks',JSON.stringify(tasks));
      taskTitle.value = ''
      taskDescription.value = ''
      taskTag.value = ''
      formAlertDOM.style.display = 'block'
      formAlertDOM.textContent = `success, task added`
      formAlertDOM.classList.add('text-success')
      showTasks("all");
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
});

async function logoutHandler(){
await axios.get('/api/v1/auth/token');
const isLogout = confirm('Are You Sure You Want To Logout..!');
if(isLogout){
 location.reload();
}
else{
}
};
select.addEventListener('click',(e)=>{
  e.preventDefault();
  const option = select.value;
  showTasks(option)

});
search.addEventListener('click',async(e)=>{
  e.preventDefault();
    const value = searchValue.value;
    const filteredTasks = [];
  try {
    let {data} = await axios.get(`/api/v1/tasks/task`);
    data.tasks.map(task=>{
      if(task.title.includes(value)||task.description.includes(value)){
        filteredTasks.push(task);
      }
      else if(value === "Completed" || value === "COMPLETED" || value === "completed"){
        if(task.completed === true){
          filteredTasks.push(task);
        }
      }
    })
    // console.log(filteredTasks);
    const allTasks = filteredTasks.map((task,index) => {
                 const { completed, id: taskID, title,description,tag } = task
                 return `<div class="single-task ${completed && 'task-completed'}" ontouchstart="touchstart(event)"  ontouchend="touchend(event)">
         <h5><span><i class="far fa-check-circle"></i></span>${title}</h5>
         <p>${description}</p>
         <b>${tag}</b>
         <div class="task-links">
         <!-- edit link -->
         <a href="task.html?id=${taskID? taskID : "Offline_Task "+index}"  class="edit-link">
         <img src="./assets/edit.png" class="edit-icon" />
    
         </a>
         <!-- delete btn -->
         <button type="button" class="delete-btn" data-id="${taskID}">
         <img src="./assets/delete.png" class="delete-icon" />
    
         </button>
         </div>
         </div>`
               })
               .join('')
             tasksDOM.innerHTML = allTasks
  } catch (error) {
    const offlineTasks = JSON.parse(localStorage.getItem('offline-tasks'));
        const tasks = Object.values(offlineTasks);
        tasks.map(task=>{
          if(task.title.includes(value)||task.description.includes(value)){
            filteredTasks.push(task);
          }
          else if(value === "Completed" || value === "COMPLETED" || value === "completed"){
            if(task.completed === true){
              filteredTasks.push(task);
            }
          }
        });
        const allTasks = filteredTasks.map((task,index) => {
          const { completed, id: taskID, title,description,tag } = task
          return `<div class="single-task ${completed && 'task-completed'}" ontouchstart="touchstart(event)"  ontouchend="touchend(event)">
  <h5><span><i class="far fa-check-circle"></i></span>${title}</h5>
  <p>${description}</p>
  <b>${tag}</b>
  <div class="task-links">
  <!-- edit link -->
  <a href="task.html?id=${taskID? taskID : "Offline_Task "+index}"  class="edit-link">
  <img src="./assets/edit.png" class="edit-icon" />

  </a>
  <!-- delete btn -->
  <button type="button" class="delete-btn" data-id="${taskID}">
  <img src="./assets/delete.png" class="delete-icon" />

  </button>
  </div>
  </div>`
        })
        .join('')
      tasksDOM.innerHTML = allTasks
  }

});


  let touchStartX = 0;
  let touchEndX = 0;
  function checkDirection(e){
    if(touchEndX < touchStartX){
      deleteTask(e,e.target.childNodes[7].childNodes[7].childNodes[1]);
    //  console.log(e);
    }
    if(touchEndX > touchStartX){
      console.log("Left Swipe");
      window.location.href = e.target.childNodes[7].childNodes[3].href;
      
    }
  }
  function touchstart(e){
    touchStartX = e.changedTouches[0].screenX;
    // console.log("touchstart");
  };
  function touchend(e){
    touchEndX = e.changedTouches[0].screenX;
    checkDirection(e)
  }

