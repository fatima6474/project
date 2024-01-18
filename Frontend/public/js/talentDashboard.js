
document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault(); 

  // Gather form data
  const name = document.getElementById("Name").value;
  const phoneNumber = document.getElementById("PhoneNumber").value;
  const email = document.getElementById("Email").value;
  const jobTitle = document.getElementById("Job_Title").value;
  const about = document.getElementById("About").value;
  const location = document.getElementById("Location").value;
  const language = document.getElementById("Language").value;
  const hourlyRate = document.getElementById("Hourly_Rate").value;

  // Since there is no 'image_path' input in your form, you can remove the line below
  // const image_path = document.getElementById('image_path').value;

  const data = {
      name,
      phoneNumber,
      email,
      jobTitle,
      about,
      location,
      language,
      hourlyRate,
      // image_path,  // Remove this line
  };

  // Use AJAX to send the form data to your server
  $.ajax({
      type: "POST",
      url: "http://localhost:305/submit",
      data: JSON.stringify(data),
      contentType: "application/json",
      success: function (response) {
          console.log("Form submitted successfully:", response);

          // Store the form data in local storage
          localStorage.setItem("name", name);
          localStorage.setItem("phoneNumber", phoneNumber);
          localStorage.setItem("email", email);
          localStorage.setItem("jobTitle", jobTitle);
          localStorage.setItem("about", about);
          localStorage.setItem("location", location);
          localStorage.setItem("language", language);
          localStorage.setItem("hourlyRate", hourlyRate);

          // Redirect to TalentEdit.html
          window.location.href = "TalentEdit.html";
      },
      error: function (error) {
          console.error("Error submitting form:", error);
          // Handle error, show an error message to the user, etc
      },
  });
});

// Add this script to handle Cloudinary response
$('.cloudinary-fileupload').unsigned_cloudinary_upload("pictures", {
    cloud_name: 'ddncl0t1i',
    upload_preset: 'pictures', // Replace with your Cloudinary upload preset
  })
  .bind('cloudinarydone', function (e, data) {
    // Update image path in local storage
    localStorage.setItem("image_path", data.result.secure_url);

    // Display the uploaded image
    const imageHolder = document.getElementById("imageHolder");
    imageHolder.innerHTML = `<img src="${data.result.secure_url}" alt="Profile Image">`;
  });

