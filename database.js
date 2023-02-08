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

try {
    db.connect(function (error) {
        if (error) {
            return "Database errror: " + error;
        }
    })
} catch (error) {
    console.log('Error at database: ' + error)
}

async function registerUser(username, email, phone, password, role, schoolName) {
    const isUsernameAvaiable = await db.promise().query(`SELECT * FROM users WHERE username=?`, [username])

    if (isUsernameAvaiable[0].length == 0) {
        await db.promise().query(`INSERT INTO users(username, email, phone, password, role, schoolName) 
            VALUES(?, ?, ?, ?, ?, ?)`, [username, email, phone, passwordHash, role, schoolName], (err, response) => {
                if(err){
                    return err
                }
            })
        
        return;
    }
    return;
}

module.exports = {
    db,
    registerUser
};