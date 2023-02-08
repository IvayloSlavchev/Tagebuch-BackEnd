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
                res
                connection.destroy();
                return;
            }
        }
    } 
)


router.post('/login', async (req, res) => {
    let { username, email, password } = req.body;

    try {

        const doesUserExist = await connection.promise().query(`SELECT * FROM users WHERE email=?`, [email]);

        if (doesUserExist[0].length === 0) {
            res.status(404).json({ msg: 'User not found' })
            connection.destroy();
            return;
        }

        const hashedPassword = doesUserExist[0].map(item => item.password);
        const doesUserProvideCorrectPassword = await bcrypt.compare(password.toString(), hashedPassword.toString());

        if (doesUserProvideCorrectPassword === false) {
            res.status(409).json({ msg: 'Incorrect password' })
            connection.destroy();
            return;
        }

       res.status(200).json({ msg: 'Logged in' })
       connection.destroy();
    } catch (error) {
         res.status(400).json({ msg: 'Error occured while trying to login: ' + error });
         connection.destroy();
    }
})
module.exports = router