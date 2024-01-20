const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { log } = require("node-wit");
const secret = "jkjkjkkjkskjksjks"
const nodeWit = require('node-wit');

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
      const foundUser = await db.query("SELECT * FROM formusers WHERE email=$1", [req.body.email])
      if (foundUser.rows.length == 0) {
          return res.json({ message: "Invalid" });
      }
      const hashedPassword = await bcrypt.compare(
          req.body.password,
          foundUser.rows[0].password
        );
        if (hashedPassword === false) {
          return res.json({ message: "Invalid" });
        }
        
        const roles = foundUser.rows[0].roles
        const username = foundUser.rows[0].name
        console.log(username);
        const email = foundUser.rows[0].email
        const id = foundUser.rows[0].id
        console.log(foundUser.rows);
        console.log(username);
        console.log(roles);
        const token = jwt.sign({ username }, secret, {
          expiresIn: 60 * 60,
        });

        return res.json({ token, message: "logged", username, roles, email, id});

    // After successfully logging in
    const user = {
      username,
      roles,
      email,
      id,
    };

    // Respond with the user information
    res.json({ token, message: "logged", ...user });
      } catch (err) {
        return next(err)
      }
    })
    module.exports= router;

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













