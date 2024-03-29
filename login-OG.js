const email = document.querySelector('#email'),
      password = document.querySelector('#password'),
      buttonBtn = document.querySelector('#submitBtn'),
      emailErrorMsg = document.querySelector('#emailErrorMessage'),
      passwordErrorMsg = document.querySelector('#passwordErrorMessage'),
      emailPattern =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      passwordPattern =   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@#()^$!%*?&]{8,}$/;
      baseURL = 'https://skillworkcommunity.onrender.com/';


buttonBtn.addEventListener('click', async (e) => {
    e.preventDefault();

if (
    emailValidation() &&
    passwordValidation() 
   
   ) {
    let userData = {
      email: email.value.trim(),
      password: password.value,
    };
    postData(`${baseURL}login`, userData);
  }


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

console.log(password.value);



async function postData(url, data) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const bodydata = await res.json();
      console.log(data);
      if (bodydata.message == "Invalid") {
        emailErrorMsg.innerText = 'Please enter your email or password';
      }
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  }
      
      
    //   .then(response => response.json())
    //   .then(data => {
    //       console.log(data);
    //   if (data.match == true) {
    //     email.value = "";
    //     password.value = "";
    //     if (data.roles == "Users") {
    //         window.location.href = "../views/signup.html";
    //     } else {
    //         window.location.href = "../views/dashboard.html";
    //     }
    //   } else {
    //     emailErrorMsg.innerText = 'Please enter your email or password';
    //   }
    //   });
    // } catch (err) {
    //   console.error(`Error: ${err}`);
    // }
  


})

