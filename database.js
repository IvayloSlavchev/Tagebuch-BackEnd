module.exports = function () {
    const mysql = require('mysql2');
    const dotenv = require('dotenv');
    dotenv.config();

    let db = mysql.createConnection({
        host: process.env.MYSQL_ADDON_HOST,
        database: process.env.MYSQL_ADDON_DB,
        user: process.env.MYSQL_ADDON_USER,
        port: process.env.MYSQL_ADDON_PORT,
        password: process.env.MYSQL_ADDON_PASSWORD,
        uri: process.env.MYSQL_ADDON_URI,
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