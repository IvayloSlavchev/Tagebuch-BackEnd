const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

let db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});
db.connect(function(error) {
    if(error){
        return console.error('Error: ' + error);
    }

    console.log("Connected to database");
})

module.exports = db;