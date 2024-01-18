const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async function (req, res, next) {
    try {
        const results = await db.query("SELECT * FROM users")
        res.json(results.rows)
        
    } catch (err) {
        return next(err);
        
    }
});

router.get("/name/:name", async (req, res, next) => {
  try {
      const results = await db.query("SELECT * FROM users WHERE name=$1", [req.params.name]);
      if (results.rows.length === 0) {
          return res.status(404).send("User not found!")
      }
      res.json(results.rows)
  } catch (err) {
      return next(err);
  }
})

router.get("/categories/:search", async (req, res, next) => {
  try {
      const results = await db.query("SELECT * FROM users WHERE name ILIKE $1", [req.params.search]);
      if (results.rows.length === 0) {
          return res.json({message: "Category not found!"})
      }
      res.json({message: "success", data: results.rows})
  } catch (err) {
      return next(err);
  }
})




// searchError.innerHTML = `There are ${numberOfItems} search results for this category`
// const numberOfItems = Object.keys(bodydata.data).length;


module.exports = router;