const { Router } = require('express');
const db = require('../database')
const router = Router();
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

router.use(cors());

router.use((req, res, next) => {
    console.log('Request made to /users')
    next()
})
router.post('/registration', async (req, res) => {
    let { username, email, phone, password, role, schoolName } = req.body;

    
    const passwordHash = await bcrypt.hash(password, 10);

    try {
         if (username && email && phone && password && role && schoolName) {
            db.query(`SELECT * FROM users WHERE username=?`,
            [username],
            function (err, response) {
                if (err) {
                    console.log(err)
                    return;
                } else {
                    if (response?.length == 0) {
                        db.promise().query(`INSERT INTO users(username, email, phone, password, role, schoolName) 
                        VALUES(?, ?, ?, ?, ?, ?)`, [username, email, phone, passwordHash, role, schoolName])
                        res.status(201).send({ msg: 'Created user' })
                        return;
                    } else {
                        res.status(409).send('Username already exists')
                        return;
                    }
                }
            })  
        }
            
    }catch(error){
        console.log(error);
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

    console.log(validCredentials[0])
    if(validCredentials[0].length === 0){
        return res.status(404).send('Not found')
    }
    validCredentials[0].map(async (item) => {   
        const validPassword = await bcrypt.compare(password, item.password);
        try{
            if (validPassword) {
                return res.status(200).send('Success')
            } else {
                return res.status(404).send('Not found');
            }
        } catch(error){
            console.error(error);
            return;
        }

    })

})
module.exports = router