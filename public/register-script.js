const formDOM = document.querySelector('.form')
const usernameInputDOM = document.querySelector('.username-input')
const passwordInputDOM = document.querySelector('.password-input')
const emailInputDOM = document.querySelector('.email-input')
const nameInputDOM = document.querySelector('.name-input')
const formAlertDOM = document.querySelector('.form-alert')
const resultDOM = document.querySelector('.result')
const btnDOM = document.querySelector('#data');
const imageInput = document.querySelector('.image-input');
const tokenDOM = document.querySelector('.token')
formDOM.addEventListener('submit', async (e) => {
  formAlertDOM.classList.remove('text-success')
  tokenDOM.classList.remove('text-success')
  e.preventDefault()
  const email = emailInputDOM.value
  const password = passwordInputDOM.value
  const name = nameInputDOM.value
  const username = usernameInputDOM.value
  const image = imageInput.files[0];
const formData = new FormData();
formData.append('email',email);
formData.append('password',password);
formData.append('username',username);
formData.append('name',name);
formData.append('image',image);
  try {
    const {data}= await axios.post('/api/v1/auth/register', formData);
    console.log(data)
   
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = data.msg
    formAlertDOM.classList.add('text-success')
    usernameInputDOM.value = ''
    passwordInputDOM.value = ''
    resultDOM.innerHTML = ''
    tokenDOM.textContent = 'token present'
    tokenDOM.classList.add('text-success')
    window.location.href  = "/tasks.html"
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = error.response.data.msg
    resultDOM.innerHTML = ''
    tokenDOM.textContent = 'no token present'
    tokenDOM.classList.remove('text-success')
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

