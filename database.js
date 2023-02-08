module.exports = function () {
    const mysql = require('mysql2');
    const dotenv = require('dotenv');
    dotenv.config();

    let db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    })
    db.connect(function (err) {
        if (err) {
            console.log(`Connection request failed: ${err}`);
        } else {
            console.log(`Database connection successfull: ${db.threadId}`);
        }
    })

    return db;
}