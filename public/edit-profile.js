const userNameInput = document.querySelector('.username_input');
const nameInput = document.querySelector('.name_input');
const userGreet = document.querySelector('.user_heading');
const emailInput = document.querySelector('.email_input');
const editProfile = document.querySelector('.usr_det');
const profileSection = document.querySelector('.dropdown-menu');

const ProfileImage = document.querySelector('.profile_image');
const logoutBtn = document.getElementsByClassName('logout')[0];
const profileImageChanger = document.querySelector('.profile_image_selector');
const params = window.location.search;
const profileName = document.querySelector('.profile-name');
const profilePic = document.querySelector('.profile-pic');
const id = new URLSearchParams(params).get('id');
let tempName;
const token = localStorage.getItem('token');
const showDetails = async () => {
  try {
    const {
      data: { user },
    } = await axios.get(`/api/v1/auth/users/${id}`,{headers:{
      "Authorization":`Bearer ${token}`
    }});
    
    const { _id: userId,username,name,profileImage,email } = user;
    profileName.innerText = user.name;
    profilePic.src = "/" + user.profileImage;
    userGreet.textContent = `Amigos..! ${name}`
    nameInput.value = name
    userNameInput.value = username
    emailInput.value = email
    ProfileImage.src = "/"+ profileImage;
    profileSection.innerHTML +=`
    <li><a class="dropdown-item edit-profile" href="edit-profile.html?id=${user._id}">Edit profile</a></li>
    `
  } catch (error) {
    console.log(error)
  }
}

showDetails()

editProfile.addEventListener('submit', async (e) => {
  e.preventDefault()
  try {
    const email = emailInput.value
    const name = nameInput.value
    const username = userNameInput.value
    const image = profileImageChanger.files[0];
  const formData = new FormData();
  formData.append('email',email);
  formData.append('username',username);
  formData.append('name',name);
  formData.append('image',image);
    const {
      data: { user },
    } = await axios.patch(`/api/v1/auth/users/${id}`, formData,{headers:{
      "Authorization":`Bearer ${token}`
    }});
    profileName.innerText = user.name;
    profilePic.src = "/" + user.profileImage;
    userGreet.textContent = `Amigos..! ${user.name}`;
    nameInput.value = user.name;
    userNameInput.value = user.username;
    emailInput.value = user.email;
    ProfileImage.src = "/"+ user.profileImage;
    location.reload();
  } catch (error) {
    console.error(error)

  }

})

logoutBtn.addEventListener('click',async()=>{
 await axios.get('/api/v1/auth/token');
  const isLogout = confirm('Are You Sure You Want To Logout..!');
  if(isLogout){
  
    location.reload();
  }
  })
  