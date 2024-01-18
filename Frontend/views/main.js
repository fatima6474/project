document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".section");
    sections.forEach(section => section.style.display = "none");

    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault(); // Prevent the default link behavior
            const target = document.querySelector(this.getAttribute("href"));
            
            if (target) {
                // Hide all sections
                sections.forEach(section => section.style.display = "none");
                // Show the target section
                target.style.display = "block";
            }
        });
    });
});



    

  document.addEventListener("DOMContentLoaded", function() {
    const welcomeAnimation = document.querySelector(".welcome-animation");
    const navigationButtons = document.querySelector(".your-navigation-buttons");

    welcomeAnimation.addEventListener("animationend", function() {
        // Animation has ended, show the navigation buttons
        navigationButtons.style.display = "block";
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const welcomeContainer = document.querySelector(".welcome-container");
    const navigationBar = document.getElementById("navbar");

    // Add a click event listener to your navigation bar or button
    navigationBar.addEventListener("click", function () {
        // Remove the entire welcome container and its contents
        welcomeContainer.remove();
    });
});


 document.addEventListener("DOMContentLoaded", function () {
            const navbarLinks = document.querySelectorAll(".nav-links a");
            const slideshowContainer = document.getElementById("slide");

            navbarLinks.forEach(link => {
                link.addEventListener("click", function () {
                    slideshowContainer.style.display = "none";
                });
            });
        });

        document.addEventListener("DOMContentLoaded", function () {
            const searchInput = document.getElementById("search-input");
            const searchResults = document.getElementById("search-results");
        
            searchInput.addEventListener("input", function () {
                const filter = searchInput.value.toUpperCase();
                searchResults.innerHTML = ""; // Clear previous search results
        
                const hrefs = {
                    "House Repairs": "houserepair.html",
                    "Make up": "makeup.html",
                    "Catering Services": "catering.html",
                    "Security Guard": "security.html",
                    "painters": "painters.html",
                    "House Helps": "helpls.html",
                    "Drivers": "driver.html",
                    "Delivery": "delivery.html",
                    "Laundry Services": "laundry.html",
                    "Hair Dressers": "hair.html",
                    "Furnitures": "furniture.html",
                    "Bakers": "bakers.html",
                    "Assistant": "assist.html",
                    "Security Guards": "security.html"
                };
        
                if (filter !== "") {
                    const matchingHrefs = Object.keys(hrefs).filter(key => key.toUpperCase().includes(filter));
        
                    matchingHrefs.forEach(key => {
                        const resultItem = document.createElement("p");
                        resultItem.textContent = key;
                        resultItem.classList.add("search-result-item");
        
                        // Handle click event on search results
                        resultItem.addEventListener("click", function () {
                            const href = hrefs[key];
                            if (href) {
                                window.location.href = href;
                            }
                        });
        
                        searchResults.appendChild(resultItem);
                    });
                }
            });
        });
                
        
        
           
        
           