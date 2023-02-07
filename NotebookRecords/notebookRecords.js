const { Router } = require('express');
const cors = require('cors');
const db = require('../database.js');
const router = Router();
const bodyParser = require('body-parser');

router.use(cors());

router.use((req, res, next) => {
    console.log('Request made to /notebookrecords')
    next();
})
router.use(bodyParser.urlencoded({ extended: false }))

router.get('/:id', async (req, res) => {
    const result = await db.promise().query(`SELECT * FROM notebookRecords`);

    res.status(200).send(result[0])
})
router.post('/', async (req, res) => {
    let { notebookName, notebookDescription, notebookTexts, ownedBy } = req.body;
    if (notebookName.length < 3) {
        res.status(449).send('Too short name');
    }

    const user_id = await db.promise().query(`SELECT id FROM users WHERE username=?`, [ownedBy]);

    if (!user_id) {
        res.status(404).send('User not found');
        return;
    }

    db.promise().query('SET FOREIGN_KEY_CHECKS=0');

    if (notebookName && ownedBy) {
        try {
            db.query(`SELECT * FROM notebookRecords WHERE notebookName= ?`,
                [notebookName],
                function (err, response) {
                    if (err) {
                        return console.log(err);
                    } else {
                        if (response?.length == 0) {
                            db.promise().query(`INSERT INTO notebookRecords(notebookName, notebookDescription, notebookTexts, ownedBy, user_id) VALUES(?, ?, ?, ?, ?)`, [notebookName, notebookDescription, notebookTexts, ownedBy, user_id[0][0].id]);
                            res.status(201).send('Notebook created!')
                        } else {
                            res.status(409).send('Notebook already exists');
                        }
                    }
                })
        } catch (error) {
            return console.log(err);
        }
    }

})
router.put('/:id', async (req, res) => {
    let { notebookName, notebookDescription, notebookTexts } = req.body;

    if (!notebookTexts) {
        res.status(404).send('Notebook not found');
        return;
    }

    await db.promise().query(`UPDATE notebookRecords SET notebookName=?, notebookDescription=?, notebookTexts=? WHERE notebookName=?`, [notebookName, notebookDescription, notebookTexts, notebookName])
    res.status(200).send({ msg: 'Updated' })
})

router.delete('/:id', async (req, res) => {
    let { notebookName } = req.body;

    if (!notebookName) {
        res.status(404).send('Please enter notebook name');
        return;
    }

    if(notebookName) {
        try {
            const countOfGivenNotebookNameInDatabase = await db.promise().query(`SELECT COUNT(notebookName) FROM notebookRecords WHERE notebookName=?`, [notebookName]);
            const gettingValuesFromDatabase = Object.values(countOfGivenNotebookNameInDatabase[0][0]);

            console.log(gettingValuesFromDatabase[0])
            if(gettingValuesFromDatabase[0] == 0){
                return res.status(404).send('Notebook not found!')
            }

            await db.promise().query(`DELETE FROM notebookRecords WHERE notebookName=?`, [notebookName])
            return res.status(200).send('Deleted successfully')
        } catch(error) {
            return res.status(404).send('Not found');
        }
    }
})
module.exports = router