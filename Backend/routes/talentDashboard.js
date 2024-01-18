const express = require("express");
const router = express.Router();
// const db = require("../db");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary")
const uploadImage = require("../utilites/index")
const upload = multer({
  dest: "./uploads"
});



router.get("/", async function (req, res, next) {
    try {
        const results = await db.query("SELECT * FROM formX")
        res.json(results.rows)
        
    } catch (err) {
        return next(err);
        
    }
});


router.post("/", upload.single("images"), async (req, res, ) =>{
  // console.log(req.body);
  // res.send(req.body)
  console.log(req.file);
  const path = req.file.path
  console.log(path);
 
  try {
    const result = await uploadImage(req.file.path);
    const queryText = ("INSERT INTO form (jobtitle, skills, about, locationx, language, rate, images) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *")
    console.log(result);
    const values = [req.body.jobtitle, req.body.skills, req.body.about, req.body.locationx, req.body.language, req.body.rate, result.url];
    const results = await db.query(queryText, values);
    console.log(results.rows[0]);
    res.json(results.rows[0]);
    console.log("next", result.url);
    console.log(results.rows[0].images);
  } catch (err) {
    throw (err);
  }
})






module.exports = router;