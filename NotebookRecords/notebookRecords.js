const { Router } = require('express');
const cors = require('cors');
const { db } = require('../database.js');
const router = Router();
const bodyParser = require('body-parser');

router.use(cors());

router.use((req, res, next) => {
    console.log('Request made to /notebookrecords')
    next();
})
router.use(bodyParser.urlencoded({ extended: false }))

router.get('/', async (req, res) => {
    try {
        const result = await db.promise().query(`SELECT * FROM notebookRecords`);

        if (!result) {
            return res.status(404).send('Notebook not found');
        }

        return res.status(200).send(result[0])
    } catch (error) {
        return res.status(400).json({ msg: 'Cannot get the book: ' + error })
    }
})
router.post('/', async (req, res) => {

    let { notebookName, notebookDescription, notebookTexts, ownedBy } = req.body;
    if (notebookName.length < 3) {
        res.status(449).json({ msg: 'Too short name' });
    }

    try {
        const user_id = await db.promise().query(`SELECT id FROM users WHERE username=?`, [ownedBy]);

        if (!user_id) {
            return res.status(404).json({ msg: 'User not found' });
        }

        db.promise().query('SET FOREIGN_KEY_CHECKS=0');

        if (notebookName && ownedBy) {
            try {
                db.query(`SELECT * FROM notebookRecords WHERE notebookName= ?`,
                    [notebookName],
                    async function (err, response) {
                        if (err) {
                            return console.log(err);
                        } else {
                            if (response?.length == 0) {
                                await db.promise().query(`INSERT INTO notebookRecords(notebookName, notebookDescription, notebookTexts, ownedBy, user_id) VALUES(?, ?, ?, ?, ?)`, [notebookName, notebookDescription, notebookTexts, ownedBy, user_id[0][0].id]);
                                return res.status(201).json({ msg: 'Notebook created!' })
                            } else {
                                return res.status(409).json({ msg: 'Notebook already exists' });
                            }
                        }
                    })
            } catch (error) {
                return res.status(400).json({ msg: 'Book can\'t: ' + error });
            }
        }
    } catch (error) {
        return res.status(400).json({ msg: 'Request cannot be proceed: ' + error })
    }
})
router.put('/:id', async (req, res) => {
    let { notebookName, notebookDescription, notebookTexts } = req.body;

    if (!notebookTexts) {
        res.status(404).json({ msg: 'Notebook not found' });
        return;
    }

    try {
        await db.promise().query(`UPDATE notebookRecords SET notebookName=?, notebookDescription=?, notebookTexts=? WHERE notebookName=?`, [notebookName, notebookDescription, notebookTexts, notebookName])
        return res.status(200).json({ msg: 'Updated' });
    } catch (error) {
        return res.status(400).json({ msg: 'Update count not proceed: ' + error })
    }
})

router.delete('/:id', async (req, res) => {
    let { notebookName } = req.body;

    if (!notebookName) {
        res.status(404).json({ msg: 'Please enter notebook name' });
        return;
    }

    if (notebookName) {
        try {
            const countOfGivenNotebookNameInDatabase = await db.promise().query(`SELECT COUNT(notebookName) FROM notebookRecords WHERE notebookName=?`, [notebookName]);
            const gettingValuesFromDatabase = Object.values(countOfGivenNotebookNameInDatabase[0][0]);

            console.log(gettingValuesFromDatabase[0])
            if (gettingValuesFromDatabase[0] == 0) {
                return res.status(404).json({ msg: 'Notebook not found!' })
            }

            await db.promise().query(`DELETE FROM notebookRecords WHERE notebookName=?`, [notebookName])
            return res.status(200).json({ msg: 'Deleted successfully' })
        } catch (error) {
            return res.status(404).json({ msg: 'Not found' })
        }
    }
})
module.exports = router