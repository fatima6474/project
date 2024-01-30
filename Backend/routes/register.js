const SibApiV3Sdk = require('sib-api-v3-sdk');
const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// const { pool } = require("./app")
// const user = await pool.query(queryText, values);
// const SibApiV3Sdk = require('sib-api-v3-sdk');

// const apiInstance = new SibApiV3Sdk({ apiKey: process.env.SENDINBLUE_API_KEY });
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi({ apiKey: process.env.SENDINBLUE_API_KEY });

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


router.post("/", async (req, res, next) => {
  let hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  let user; // Move the declaration here

  try {
    const results = await pool.query("SELECT email FROM formusers WHERE email=$1", [req.body.email]);
    if (results.rows.length > 0) {
      res.json({ message: "Already Exists" });
    } else {
      const queryText = "INSERT INTO formusers (name, email, password, roles) VALUES ($1, $2, $3, $4) RETURNING *";
      const values = [req.body.name, req.body.email, hashedPassword, req.body.roles];
      user = await pool.query(queryText, values);
      res.json({ success: true, data: user.rows[0], message: "Success" });
    }

    const emailData = {
      to: { email: user.email }, // Use the user variable here
      subject: 'Welcome to Skill Work Community!',
      htmlContent: 'Hi there, thanks for signing up!...',
      from: { email: 'welcome@skill-workcommunity.com.ng' },
    };

    apiInstance.transactionalEmailsApi.sendTransacEmail(emailData)
      .then(() => {
        console.log('Welcome email sent to:', user.email);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  } catch (err) {
    return next(err);
  }
});





module.exports = router;
