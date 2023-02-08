const { Router } = require('express');
const connectToDatabase = require('../database')
const router = Router();
const cors = require('cors');
const bcrypt = require('bcrypt');

router.use(cors());

let connection = connectToDatabase();
router.use((req, res, next) => {
    console.log('Request made to /users')
    next()
})
router.post('/registration', async (req, res) => {
    let { username, email, phone, password, role, schoolName } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);


    if (username && email && phone && password && role && schoolName) {
        try {
            const isValid = await connection.promise().query(`SELECT * FROM users WHERE username=?`, [username])

            if (isValid[0].length === 0) {
                await connection.promise().query(`INSERT INTO users(username, email, phone, password, role, schoolName) 
                            VALUES(?, ?, ?, ?, ?, ?)`, [username, email, phone, passwordHash, role, schoolName]);
                res.status(201).json({ msg: 'Created' })
                connection.destroy();
                return;
            }

            res.status(400).json({ msg: 'User already exists' })
            connection.destroy();
            return;
        } catch (error) {
            console.log('An error occured when trying to register: ' + error);
            connection.destroy();
            return;
        }
    }
})

router.post('/login', async (req, res) => {
    let { username, email, password } = req.body;

    const doesUserExist = await connection.promise().query(`SELECT * FROM users WHERE email=?`, [email]);

    if (doesUserExist[0].length === 0) {
        return res.status(404).json({ msg: 'User not found' })
    }
    return res.status(200).json({ msg: 'Logged in' })
})
module.exports = router