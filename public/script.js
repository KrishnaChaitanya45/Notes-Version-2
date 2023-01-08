const formDOM = document.querySelector('.form')
const usernameInputDOM = document.querySelector('.username-input')
const passwordInputDOM = document.querySelector('.password-input')
const formAlertDOM = document.querySelector('.form-alert')
const resultDOM = document.querySelector('.result')
const btnDOM = document.querySelector('#data')
const checkToken = async() => {
  let token;
  const cookie = document.cookie.split(';');
  cookie.map(item=>{
   const tokenNames = item.split('=');
   if(tokenNames[0].includes("TaskManagerToken")){
    token = tokenNames[1];
   }
  })
  if (token) {
    const {data} = await axios.post('/api/v1/auth/token',{token:token});
    if(data.user){
         console.log("redirected")
        window.location.href = '/tasks.html';
       }
       else{
        window.location.href = '/register.html';
       }
  }
}
checkToken()

formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  formAlertDOM.classList.remove('text-success')
  const email = usernameInputDOM.value
  const password = passwordInputDOM.value

  try {
  // const token = localStorage.getItem('token');
    const {data}= await axios.post('/api/v1/auth/login', {email:email,password:password});
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = data.msg
    formAlertDOM.classList.add('text-success')
    localStorage.clear();
    localStorage.setItem('token', data.token)
    localStorage.setItem('User', data.user)
    window.location.href  = "/tasks.html";
    resultDOM.innerHTML = ''
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = error.response.data.msg
    localStorage.removeItem('token')
    resultDOM.innerHTML = ''
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
  }, 2000)
})

// btnDOM.addEventListener('click', async () => {
//   const token = localStorage.getItem('token')
//   try {
//     const { data } = await axios.get('/api/v1/auth/register', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     resultDOM.innerHTML = `<h5>${data.msg}</h5><p>${data.secret}</p>`

//     data.secret
//   } catch (error) {
//     localStorage.removeItem('token')
//     resultDOM.innerHTML = `<p>${error.response.data.msg}</p>`
//   }
// })

