// const {Client} = require("pg");
// require("dotenv").config()
// console.log();
// const client = new Client({
//     user: process.env.DB_USER,
//     database: process.env.DB_DATABASE,
//     host: process.env.DB_HOST,
//     password: process.env.DB_PASSWORD,
//     port: 5432
// });

// client.connect();

// module.exports = client;

const client = new pool({
    user:   process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,

   ssl: {
    rejectUnauthorized: false,
   },
   sslmode: 'require'
});