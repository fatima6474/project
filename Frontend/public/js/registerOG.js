const username = document.querySelector('#username'),
      email = document.querySelector('#email'),
      password = document.querySelector('#password'),
      password2 = document.querySelector('#password2'),
      buttonBtn = document.querySelector('#submitBtn'),
      checkBox = document.querySelectorAll('.radioBtn'),
      usernameErrorMsg = document.querySelector('#usernameErrorMessage'),
      emailErrorMsg = document.querySelector('#emailErrorMessage'),
      passwordErrorMsg = document.querySelector('#passwordErrorMessage'),
      password2ErrorMsg = document.querySelector('#password2ErrorMessage'),
      emailPattern =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
      baseURL = 'https://skillworkcommunity.onrender.com/';


buttonBtn.addEventListener('click', async (e) => {
    const role = check()
    e.preventDefault();

if (
    nameValidation() &&
    emailValidation() &&
    passwordValidation() &&
    confirmPasswordValidation()
   
  ) {
    let userData = {
      name: username.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value,
      roles: role
    };
    postData(`${baseURL}register`, userData);
    console.log(`This is the ${role}`);
  }



function nameValidation(){
    if (username.value === '') {
        usernameErrorMsg.innerText = 'Please enter your username';
        username.classList.add('error');
    }   else if (username.value.trim().length < 3) {
        usernameErrorMsg.innerText = 'Name must be at least 3 characters';
        username.classList.add('error');
    }   else {
        usernameErrorMsg.innerText = '';
        return true;
    }
}
username.addEventListener("input", nameValidation);

function emailValidation(){
    if (email.value === '') {
        emailErrorMsg.innerText = 'Please enter your email';
        email.classList.add('error');
    }   else if (email.value.trim().length < 3) {
        emailErrorMsg.innerText = 'Name must be at least 3 characters';
        email.classList.add('error');
    }       else if (!email.value.match(emailPattern)){
        emailErrorMsg.innerText = "Please enter a valid email.";
        emailErrorMsg.classList.add('error');
    }   else {
        emailErrorMsg.innerText = '';
        return true;
    }
}
email.addEventListener("input", emailValidation);

function check(){
    var role;
    checkBox.forEach((btn)=>{
        if (btn.checked) {
            console.log(btn, btn.value);
            role = btn.value
            console.log(role);
            return
        }
    })
    return role
}
check()

function passwordValidation(){
    if (password.value === '') {
        passwordErrorMsg.innerText = 'Please enter your Password'
        password.classList.add('error');
    }   else if (password.value.trim().length < 8) {
        passwordErrorMsg.innerText = 'Password must be at least 8 characters';
    }   else if (!password.value.match(passwordPattern)){
        passwordErrorMsg.innerText = "Please enter at least 8 character with number, symbol, small and capital letter.";
        passwordErrorMsg.classList.add('error');
    }   else {
        passwordErrorMsg.innerText = '';
        return true;
    }
}

password.addEventListener("input", passwordValidation);

function confirmPasswordValidation(){
    if  (password2.value !== password.value) {
        password2ErrorMsg.innerText = "Passwords don't match";
        password2ErrorMsg.classList.add('error')
    }   else {
        password2ErrorMsg.innerText = '';
        return true
    }
}

password2.addEventListener("input", confirmPasswordValidation);




async function postData(url, data) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(response => response.json())
      .then(data => {
          console.log(data);
      });
      console.log(data);









      // if (bodydata.success == true) {
      //   alert("Done")
      //   username.value = "";
      //   email.value = "";
      //   password.value = "";
      //   confirmPassword.value = "";
      //   // setTimeout(() => {
      //   //     window.location()
      //   // }, 2000);
      // }
      // if (bodydata.message =='duplicate key value violates unique constraint "users_email_key"') {
      //   emailErrorMsg.innerText = "Please enter a valid email.";
      //   emailErrorMsg.classList.add('error');
      //   // signupMsg.textContent = "Email Already Exist";
      //   // signupMsg.style.color = "red";
      //   email.value = "";
      // }
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  


}
})





















// function getValue() {
//     var checkboxes =
//         document.getElementsByName('radiobutton');
//     var result = "";
//     for (var i = 0; i < checkboxes.length; i++) {
//         if (checkboxes[i].checked) {
//             result += checkboxes[i].value;
//         }
//     }
// }











































































































































































// const username = document.querySelector('#username'),
//       email = document.querySelector('#email'),
//       password = document.querySelector('#password'),
//       password2 = document.querySelector('#password2'),
//       buttonBtn = document.querySelector('#submitBtn'),
//       usernameErrorMsg = document.querySelector('#usernameErrorMessage'),
//       emailErrorMsg = document.querySelector('#emailErrorMessage'),
//       passwordErrorMsg = document.querySelector('#passwordErrorMessage'),
//       password2ErrorMsg = document.querySelector('#password2ErrorMessage'),
//       emailPattern =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
//       passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
//       baseURL = 'http://localhost:450';


// submitBtn.addEventListener('click', async (e) => {
//     e.preventDefault();


//     if (username.value === '') {
//         usernameErrorMsg.innerText = 'Please enter your username';
//         username.classList.add('error');
//     }   else if (username.value.trim().length < 3) {
//         usernameErrorMsg.innerText = 'Name must be at least 3 characters';
//         username.classList.add('error');
//     }   else {
//         username.innerText = '';
//     }

//     if (email.value === '') {
//         emailErrorMsg.innerText = 'Please enter your email';
//         email.classList.add('error');
//     }   else if (email.value.trim().length < 3) {
//         emailErrorMsg.innerText = 'Name must be at least 3 characters';
//         email.classList.add('error');
//     }       else if (!email.value.match(emailPattern)){
//         emailErrorMsg.innerText = "Please enter a valid email.";
//         emailErrorMsg.classList.add('error');
//     }   else {
//         emailErrorMsg.innerText = '';
//     }

//     if (password.value === '') {
//         passwordErrorMsg.innerText = 'Please enter your Password'
//         password.classList.add('error');
//     }   else if (password.value.trim().length < 8) {
//         passwordErrorMsg.innerText = 'Password must be at least 8 characters';
//     }   else if (!password.value.match(passwordPattern)){
//         passwordErrorMsg.innerText = "Please enter at least 8 character with number, symbol, small and capital letter.";
//         passwordErrorMsg.classList.add('error');
//     }   else {
//         passwordErrorMsg.innerText = '';
//     }

//     if  (password2.value !== password.value) {
//         password2ErrorMsg.innerText = "Passwords don't match";
//         password2ErrorMsg.classList.add('error')
//     }   else {
//         password2ErrorMsg.innerText = '';
//     }

//     await fetch(baseURL+ "/register/register", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ name: username.value, email: password.value})
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//         })
    

// })

























// showHiddenPass('passwordInput','eye')














































// const showHiddenConfirmPass = (confirmPasswordInput, confirmEye) =>{
//    const confirmPassword = document.querySelector('#confirmPasswordInput'),
//          confirmIconEye = document.querySelector('#confirmEye')

//    confirmIconEye.addEventListener('click', () =>{
//       if(confirmPassword.type === 'password'){
//          confirmPassword.type = 'text'

//          confirmIconEye.classList.add('bx-hide')
//          confirmIconEye.classList.remove('bx-show')
//       } else{
//          confirmPassword.type = 'password'

//          confirmIconEye.classList.remove('bx-hide')
//          confirmIconEye.classList.add('bx-show')
//       }
//    })
// }

// showHiddenConfirmPass('confirmPasswordInput','confirmEye');
