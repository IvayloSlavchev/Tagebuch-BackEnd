const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();


let db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
}).promise();
db.connect(function (error) {
    try {
        if (error) {
            return console.error('Error: ' + error);
        }
        return db
    } catch (err) {
        return err;
    } 
})

module.exports = db;