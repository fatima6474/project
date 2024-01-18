// const { all } = require("axios");

const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const startBtn = document.getElementById('startBtn');
const freelancerBtn = document.getElementById('freelancerBtn');


loginBtn.addEventListener("click", function() {
    window.location.href = "../views/login.html";
});

signupBtn.addEventListener("click", function() {
    window.location.href = "../views/register.html";
});

startBtn.addEventListener("click", function() {
    window.location.href = "../views/register.html";
});

signupBtn.addEventListener("click", function() {
    window.location.href = "../views/register.html";
});



if((!search)) {
    await fetch(baseURL + '/roles',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => response.json())
    .then(item => {
        if (item.success == true){
            allItems
        }
    })
}



$(document).ready(function(){
    $('.customer-logos').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        arrows: false,
        dots: false,
        pauseOnHover: false,
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 4
            }
        }, {
            breakpoint: 520,
            settings: {
                slidesToShow: 3
            }
        }]
    });
});

