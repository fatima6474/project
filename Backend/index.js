const express = require("express");
const app = express();
const cloudinary = require("cloudinary").v2;
const bodyParser = require('body-parser');

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cloudinary configuration
cloudinary.config({
    cloud_name: "kene281",
    api_key: "732861594881567",
    api_secret: "Ep-5NMqJzXh6RejlWo086XN5DS4",
});

app.get("/", (request, response) => {
  response.json({ message: "Hey! This is your server response!" });
});

// image upload API
app.post("/image-upload", (request, response) => {
    // collected image from a user
    const data = {
      image: request.body.image,
    }
        // upload image here
        cloudinary.uploader.upload(data.image)
        .then((result) => {
          response.status(200).send({
            message: "success",
            result,
          });
        }).catch((error) => {
          response.status(500).send({
            message: "failure",
            error,
          });
        });

    // upload image here

});

app.listen(204, ()=>{
    console.log("Server running on port 204");
})

// module.exports = app;