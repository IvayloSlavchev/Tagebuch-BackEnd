const { Router } = require('express');
const { db, registerUser } = require('../database')
const router = Router();
const cors = require('cors');
const bcrypt = require('bcrypt');



router.use((req, res, next) => {
    console.log('Request made to /users')
    next()
})
router.post('/registration', async (req, res) => {
    let { username, email, phone, password, role, schoolName } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    try {
        if (username && email && phone && password && role && schoolName) {
            try {
                registerUser(username, email, phone, password, role, schoolName);
                res.status(201).json({ msg: 'User created' })
            } catch(err) {
                res.status(400).send('An error has occured when trying to register')
            }
            // const isUsernameAvaiable = await db.promise().query(`SELECT * FROM users WHERE username=?`, [username])

            // if (isUsernameAvaiable[0].length == 0) {
            //     await db.promise().query(`INSERT INTO users(username, email, phone, password, role, schoolName) 
            //         VALUES(?, ?, ?, ?, ?, ?)`, [username, email, phone, passwordHash, role, schoolName], (err, response) => {
            //             if(err){
            //                 res.status(400).json({ msg: 'An error has occured when trying to register' })
            //             }
            //         })
                
            //     return res.status(201).json({ msg: 'Created user' })
            // }
            // return res.status(409).json({ msg: 'Username already exists' })
        }
    } catch (error) {
        console.log('An error occured when trying to register' + error);
        return;
    }
})
router.get('/login', async (req, res) => {
    const result = await db.promise().query(`SELECT * FROM users`)
    res.status(200).send(result[0])
})
router.post('/login', async (req, res) => {
    let { username, email, password } = req.body;

    const validCredentials = await db.promise().query(`SELECT * FROM users WHERE email='${email}'`);

    if (validCredentials[0].length === 0) {
        return res.status(404).send('Not found')
    }
    validCredentials[0].map(async (item) => {
        const validPassword = await bcrypt.compare(password, item.password);

        try {
            if (validPassword) {
                return res.status(200).json({ msg: 'Successfully logged in' });
            } else {
                return res.status(400).json({ msg: 'Invalid password' });
            }
        } catch (error) {
            console.error("Login error " + error);
            return;
        }

    })

})
module.exports = router