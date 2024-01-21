const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// const { pool } = require("./app")




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





  router.post("/", async (req, res, next) =>{
    let hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
    try {
      const results = await pool.query("SELECT email FROM formusers WHERE email=$1", [req.body.email]);
      if (results.rows.length > 0) {
        res.json({ message: "Already Exists" });
      } else {
        const queryText = ("INSERT INTO formusers (name, email, password, roles) VALUES ($1, $2, $3, $4) RETURNING *")
        const values = [req.body.name, req.body.email, hashedPassword, req.body.roles];
        const user = await db.query(queryText, values);
        res.json({success: true, data: user.rows[0], message: "Success"});
      }
    } catch (err) {
      return next(err)
    }
  })




module.exports = router;
