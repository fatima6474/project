const email = document.querySelector('#email'),
      password = document.querySelector('#password'),
      buttonBtn = document.querySelector('#submitBtn'),
      emailErrorMsg = document.querySelector('#emailErrorMessage'),
      passwordErrorMsg = document.querySelector('#passwordErrorMessage'),
      emailPattern =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      passwordPattern =   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@#()^$!%*?&]{8,}$/;
      baseURL = "https://skillworkcommunity.onrender.com/";


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
    console.log("line 23");
    loginPost(`${baseURL}login`, userData);
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

async function loginPost(url, data) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    
    const bodydata = await res.json();
    if (bodydata.message == "Invalid") {
      emailErrorMsg.innerText = 'Please enter your correct email or password';
    }
    console.log(bodydata.token);
    localStorage.setItem("token", bodydata.token);
    localStorage.setItem("username", bodydata.username);
    localStorage.setItem("email", bodydata.email);
    localStorage.setItem("roles", bodydata.roles);
    console.log(bodydata.username);
    console.log(bodydata.email);
    console.log(bodydata.roles);
    console.log(bodydata.token);

    if (bodydata.message == "logged") {
 
      if (bodydata.roles === "Freelancer") {
        window.location.href = "../views/talentEdit.html";
    } else {
    window.location.href =  "../views/index2.html";
    }
  
    
      console.log(bodydata);
      console.log(data);
    }
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}


})


// const loginBtn = document.getElementById('loginBtn');
// const signupBtn = document.getElementById('signupBtn');


// loginBtn.addEventListener("click", function() {
//     window.location.href = "login.html";
// });

// signupBtn.addEventListener("click", function() {
//     window.location.href = "register.html";
// });






document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form');
  const submitBtn = document.getElementById('submitBtn');

  submitBtn.addEventListener('click', function () {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Check if the provided credentials match the specified values
      if (email === 'fatiadmin@gmail.com' && password === 'Fatimaqwerty@6474') {
          // Redirect to admin.html
          window.location.href = 'admin.html';
      } else {
          // Display an error message (you can customize this part)
          alert('Invalid email or password. Please try again.');
      }
  });
});

// async function postData(url, data) {
//     try {
//       const res = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       })
//       const bodydata = await res.json();
//       console.log(data);
//       if (bodydata.message == "Invalid") {
//         emailErrorMsg.innerText = 'Please enter your email or password';
//       }
//     } catch (err) {
//       console.error(`Error: ${err}`);
//     }
//   }
      
      
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
  