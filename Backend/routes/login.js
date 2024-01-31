const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { log } = require("node-wit");
const secret = "jkjkjkkjkskjksjks"
const nodeWit = require('node-wit');
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
    user: 'skillworkcommunity@gmail.com',
    pass: 'ktik lfhp mnxx hmqs' 
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

    const mailOptions = {
      from: 'skillworkcommunity@gmail.com',
      to: email,
      subject: 'Welcome Back to Skill Work Community!',
      text: `Dear ${username},

      Welcome back to Skill Work Community! 🎉

      We're thrilled to have you back and hope you're ready for another round of connecting with local talents and exploring new opportunities.

      Your last login was a reminder of the vibrant community we have, and we're excited to continue supporting you in your journey. Whether you're searching for skilled professionals or offering your expertise to others, Skill Work Community is the perfect place to build connections.

      As you explore the platform, remember that our team is here to assist you. If you have any questions or need help with anything, feel free to reach out. We're dedicated to making your experience enjoyable and rewarding.

      Contact Support:
      - Email: support@skillworkcommunity.com
      - Phone: +234 8064743907

      Thank you for being a valued member of Skill Work Community. Let's continue building and growing together!

      Best regards,
      The Skill Work Community Team
      `
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














