const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// const { pool } = require("./app")
const nodemailer = require("nodemailer");



const { Pool } = require("pg");





// PostgreSQLzz connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  ssl:{
    rejectUnauthorized: false,
  },
  sslmode: 'require'
});




// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'skillworkcommunity@gmail.com', // replace with your email
    pass: 'ktik lfhp mnxx hmqs' // replace with your email password
  }
});










router.post("/", async (req, res, next) => {
  let hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  try {
    const results = await pool.query("SELECT email FROM formusers WHERE email=$1", [req.body.email]);
    if (results.rows.length > 0) {
      res.json({ message: "Already Exists" });
    } else {
      const queryText = "INSERT INTO formusers (name, email, password, roles) VALUES ($1, $2, $3, $4) RETURNING *";
      const values = [req.body.name, req.body.email, hashedPassword, req.body.roles];
      const user = await pool.query(queryText, values);

      // // Send email to the user
      // const mailOptions = {
      //   from: 'skillworkcommunity@gmail.com', // replace with your email
      //   to: req.body.email,
      //   subject: 'Welcome to skill work community',
      //   text: `Hello ${req.body.name},\n\nThank you for signing up on Your App!`
      // };
      const mailOptions = {
        from: 'skillworkcommunity@gmail.com',
        to: req.body.email,
        subject: 'Welcome to Skill Work Community',
        text: `Dear ${req.body.name},
    
        Welcome to Skill Work Community! 🎉
    
        We're thrilled to have you as part of our community. Skill Work Community is all about connecting clients with local skills. Whether you're looking for talented professionals or offering your skills to others, you're in the right place.
    
        Your journey to discovering and collaborating with local talents starts now. If you have any questions or need assistance, feel free to reach out. Our team is here to help.
    
        Thank you for joining Skill Work Community. Let's build and grow together!
    
        Best regards,
        The Skill Work Community Team
        `
    };
    

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error('Error sending email:', error);
          res.json({ success: true, data: user.rows[0], message: "Success", emailStatus: "Email not sent" });
        } else {
          console.log('Email sent successfully:', info.response);
          res.json({ success: true, data: user.rows[0], message: "Success", emailStatus: "Email sent successfully" });
        }
      });
    }
  } catch (err) {
    return next(err);
  }
});





router.get("/", async function (req, res, next) {
    try {
        const results = await pool.query("SELECT * FROM formusers")
        res.json(results.rows)
        
    } catch (err) {
        return next(err);
        
    }
});

router.get("/name/:name", async (req, res, next) => {
  try {
      const results = await pool.query("SELECT * FROM formusers WHERE name=$1", [req.params.name]);
      if (results.rows.length === 0) {
          return res.status(404).send("User not found!")
      }
      res.json(results.rows)
  } catch (err) {
      return next(err);
  }
})

router.get("/roles/:roles", async (req, res, next) => {
  try {
      const results = await pool.query("SELECT * FROM formusers WHERE roles=$1", [req.params.roles]);
      if (results.rows.length === 0) {
          return res.status(404).send("User not found!")
      }
      res.json(results.rows)
  } catch (err) {
      return next(err);
  }
})





module.exports = router;
