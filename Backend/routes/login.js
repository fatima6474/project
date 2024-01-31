const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { log } = require("node-wit");
const secret = "jkjkjkkjkskjksjks"
const nodeWit = require('node-wit');


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




router.get("/", async function (req, res, next) {
    try {
        const results = await db.query("SELECT * FROM formusers")
        res.json(results.rows)
        
    } catch (err) {
        return next(err);
        
    }
});


router.post("/", async (req, res, next) => {
  try {
    const foundUser = await pool.query("SELECT * FROM formusers WHERE email=$1", [req.body.email]);
    if (foundUser.rows.length === 0) {
      return res.json({ message: "Invalid" });
    }

    const hashedPassword = await bcrypt.compare(req.body.password, foundUser.rows[0].password);
    if (hashedPassword === false) {
      return res.json({ message: "Invalid" });
    }

    const roles = foundUser.rows[0].roles;
    const username = foundUser.rows[0].name;
    const email = foundUser.rows[0].email;
    const id = foundUser.rows[0].id;

    // Generate JWT token
    const token = jwt.sign({ username }, secret, {
      expiresIn: 60 * 60,
    });

    // Send email to the user
    const mailOptions = {
      from: 'skillworkcommunity@gmail.com',
      to: email,
      subject: 'Login Successful - Skill Work Community',
      text: `Dear ${username},\n\nYou have successfully logged in to Skill Work Community!`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Error sending email:', error);
        res.json({ token, message: "logged", username, roles, email, id, emailStatus: "Email not sent" });
      } else {
        console.log('Email sent successfully:', info.response);
        res.json({ token, message: "logged", username, roles, email, id, emailStatus: "Email sent successfully" });
      }
    });
  } catch (err) {
    console.error("Error during login:", err);
    return next(err);
  }
});

module.exports = router;

// router.post("/", async (req, res, next) => {
//     try {
//         const foundUser = await db.query("SELECT * FROM formusers WHERE email=$1", [req.body.email])
//         const roles = foundUser.rows[0].roles
//         const email = foundUser.rows[0].email
//         const username = foundUser.rows[0].name
//         console.log(username);
//         console.log(foundUser.rows);
//         if (foundUser.rows.length == 0) {
//             return res.json({ message: "Invalid" });
//         }
//         const hashedPassword = await bcrypt.compare(
//             req.body.password,
//             foundUser.rows[0].password
//           );
//           if (hashedPassword === false) {
//             return res.json({ message: "Invalid" });
//           }
//           const token = jwt.sign({username}, secret, {
//             expiresIn: 60 * 60
//           });

//           console.log(username);
//           console.log(token);
//           return res.json({token, message: "logged", username, email, roles});
//         } catch (err) {
//           return next(err)
//     }
// })



// module.exports= router;














