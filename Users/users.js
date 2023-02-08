const { Router } = require('express');
const { db } = require('../database')
const router = Router();
const cors = require('cors');
const bcrypt = require('bcrypt');

router.use(cors());

router.use((req, res, next) => {
    console.log('Request made to /users')
    next()
})
router.post('/registration', async (req, res) => {
    let { username, email, phone, password, role, schoolName } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);


    if (username && email && phone && password && role && schoolName) {
        try {
            const isValid = await db.promise().query(`SELECT * FROM users WHERE username=?`, [username])
          
            if (isValid[0].length === 0) {
                await db.promise().query(`INSERT INTO users(username, email, phone, password, role, schoolName) 
                            VALUES(?, ?, ?, ?, ?, ?)`, [username, email, phone, passwordHash, role, schoolName]);
                return res.status(201).json({ msg: 'Created' })
            }

            return res.status(400).json({ msg: 'User already exists' })
        } catch (error) {
            console.log('An error occured when trying to register' + error);
            return;
        }
    }
})

router.post('/login', async (req, res) => {
    let { username, email, password } = req.body;

    const doesUserExist = await db.promise().query(`SELECT * FROM users WHERE email=?`, [email]);

    if(doesUserExist[0].length === 0) {
        return res.status(404).send('User not found')
    }
    return res.status(200).send('Logged in')
})
module.exports = router