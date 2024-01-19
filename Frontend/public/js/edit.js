const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const startBtn = document.getElementById('startBtn');
const freelancerBtn = document.getElementById('freelancerBtn');
const searchBtn = document.getElementById('searchBtn');
const searchError = document.getElementById('searchError')


loginBtn.addEventListener("click", function() {
    window.location.href = "login.html";
});

signupBtn.addEventListener("click", function() {
    window.location.href = "register.html";
});

startBtn.addEventListener("click", function() {
    window.location.href = "register.html";
});

signupBtn.addEventListener("click", function() {
    window.location.href = "register.html";
});





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
function generateCard(category) {
    return `
      <div class="card">
        <div class="poster"><img src="../public/images/${category.image_path}" alt="${category.id}"></div>
        <div class="details">
            <h1>${category.name}</h1>
            <p class="desc">${category.description}</p>
        </div>
      </div>
    `;
  }


searchBtn.addEventListener('click', async ()=>{

        const searchItem = document.getElementById('search').value
        console.log(searchItem);
        const baseURL = 'https://skillworkcommunity.onrender.com/dashboard/categories/';
       const res =  await fetch(baseURL + searchItem, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        function away(){
            searchError.innerHTML = ` `
        }

        const bodydata = await res.json();

        if (bodydata.message == "Category not found!") {
            searchError.innerHTML = `No Category found for ${searchItem}`
            setTimeout(() => {
                searchError.innerHTML = "";
            }, 3000);
        } else{
            const numberOfItems = Object.keys(bodydata.data).length;
            searchError.innerHTML = `There are ${numberOfItems} search results for this category`
            setTimeout(() => {
                searchError.innerHTML = "";
            }, 6000);
        }
})




