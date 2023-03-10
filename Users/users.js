const { Router } = require('express');
const { db } = require('../database.js')
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
                return res.status(400).json({ msg: 'An error occured when tried to register: ' + error })
            }
        }
    } 
)


router.post('/login', async (req, res) => {
    let { username, email, password } = req.body;

    try {

        const doesUserExist = await db.promise().query(`SELECT * FROM users WHERE email=?`, [email]);

        if (doesUserExist[0].length === 0) {
            return res.status(404).json({ msg: 'User not found' })
        }

        const hashedPassword = doesUserExist[0].map(item => item.password);
        const doesUserProvideCorrectPassword = await bcrypt.compare(password.toString(), hashedPassword.toString());

        if (doesUserProvideCorrectPassword === false) {
            return res.status(409).json({ msg: 'Incorrect password' })
        }

       return res.status(200).json({ msg: 'Logged in' })
    } catch (error) {
         return res.status(400).json({ msg: 'Error occured while trying to login: ' + error });
    }
})
module.exports = router