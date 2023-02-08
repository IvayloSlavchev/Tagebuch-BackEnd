const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

let db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
db.connect(function(err) {
    if(err){
        console.log(`Connection request failed: ${err}`);
        return;
    }

})

module.exports = {
    db
}