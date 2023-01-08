const taskIDDOM = document.querySelector('.task-edit-id')
const taskTitle = document.querySelector('.title')
const taskDescription = document.querySelector('.description')
const taskTag = document.querySelector('.tag')
const logoutBtn = document.getElementsByClassName('logout')[0];
const taskCompletedDOM = document.querySelector('.task-edit-completed')
const editFormDOM = document.querySelector('.single-task-form')
const editBtnDOM = document.querySelector('.task-edit-btn')
const formAlertDOM = document.querySelector('.form-alert')
const params = window.location.search
const id = new URLSearchParams(params).get('id')
let tempName;
const token = localStorage.getItem('token');
const showTask = async () => {
  try {
    const {
      data: { task },
    } = await axios.get(`/api/v1/tasks/task/${id}`,{headers:{
      "Authorization":`Bearer ${token}`
    }});
    
    const { _id: taskID, completed, title,description,tag } = task[0];

    taskIDDOM.textContent = taskID
    taskDescription.value = description
    taskTag.value = tag
    taskTitle.value = title
    tempName = title
    if (completed) {
      taskCompletedDOM.checked = true
    }
  } catch (error) {
     const queryString = window.location.search;
    const query = queryString.split('=')[1];
    const offlineTasks = JSON.parse(localStorage.getItem('offline-tasks'));
    
    const task = offlineTasks.filter(task=>{
      return task.id === query;
    });
    const { id: taskID, completed, title,description,tag } = task[0];

    taskIDDOM.textContent = taskID
    taskDescription.value = description
    taskTag.value = tag
    taskTitle.value = title
    tempName = id
    if (completed) {
      taskCompletedDOM.checked = true
    }
  }
}

showTask()

editFormDOM.addEventListener('submit', async (e) => {
  editBtnDOM.textContent = 'Loading...'
  e.preventDefault()
  try {
    const updatedtaskName = taskTitle.value
    const updatedtaskCompleted = taskCompletedDOM.checked
    const updatedtaskTag = taskTag.value;
    const updatedtaskDescription = taskDescription.value

    const {
      data: { task },
    } = await axios.patch(`/api/v1/tasks/task/${id}`, {
      title: updatedtaskName,
      completed: updatedtaskCompleted,
      description:updatedtaskDescription,
      tag:updatedtaskTag
    },{headers:{
      "Authorization":`Bearer ${token}`
    }});

    const { _id: taskID, completed, title,description,tag } = task

    taskIDDOM.textContent = taskID
    taskTag.value = tag
    taskDescription.value = description
    taskTitle.value = title
    tempName = title
    if (completed) {
      taskCompletedDOM.checked = true
    }
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, edited task`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    const updatedtaskName = taskTitle.value
    const updatedtaskCompleted = taskCompletedDOM.checked
    const updatedtaskTag = taskTag.value;
    const updatedtaskDescription = taskDescription.value
    const offlineTasks = JSON.parse(localStorage.getItem("offline-tasks"));
    offlineTasks.forEach(task=>{
      if(task.id === tempName){
        task.title= updatedtaskName;
        task.description = updatedtaskDescription;
        task.completed = updatedtaskCompleted;
        task.tag = updatedtaskTag;
      }
    });
    if (updatedtaskCompleted) {
      taskCompletedDOM.checked = true
    }
    localStorage.setItem("offline-tasks",JSON.stringify(offlineTasks));

    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, edited task`
    formAlertDOM.classList.add('text-success')

    // console.error(error)
    // taskNameDOM.value = tempName
    // formAlertDOM.style.display = 'block'
    // formAlertDOM.innerHTML = `error, please try again`
  }
  editBtnDOM.textContent = 'Edit'
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})

logoutBtn.addEventListener('click',async()=>{
  await axios.get('/api/v1/auth/token');
   const isLogout = confirm('Are You Sure You Want To Logout..!');
   if(isLogout){
   
     location.reload();
   }
   })
   