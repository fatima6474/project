// script.js
document.addEventListener('DOMContentLoaded', function () {
    // Fetch and display freelancers on page load
    fetchFreelancers();

    document.getElementById('freelancerForm').addEventListener('submit', function (event) {
        event.preventDefault();
        // ... (same form submission code as before)
    });
});

function fetchFreelancers() {
    // Fetch freelancers from the server
    fetch('/api/freelancers')
        .then(response => response.json())
        .then(freelancers => {
            // Update the HTML content with freelancer information
            updateFreelancerList(freelancers);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateFreelancerList(freelancers) {
    const freelancerList = document.getElementById('freelancerList');

    // Clear existing list items
    freelancerList.innerHTML = '';

    // Append new list items for each freelancer
    freelancers.forEach(freelancer => {
        const listItem = document.createElement('li');
        listItem.textContent = `Name: ${freelancer.name}, Email: ${freelancer.email}, Category: ${freelancer.category}`;
        freelancerList.appendChild(listItem);
    });
}
