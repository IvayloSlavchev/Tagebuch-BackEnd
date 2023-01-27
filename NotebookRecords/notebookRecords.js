 const { Router } = require('express');
const cors = require('cors');
const db = require('../database.js');
const router = Router();

router.use(cors());

router.use((req, res, next) => {
    console.log('Request made to /notebookrecords')
    next();
})

router.get('/:id', async (req, res) => {
    const result = await db.promise().query(`SELECT * FROM notebookRecords`);
    
    res.status(200).send(result[0])
})
router.post('/', async (req, res) => {
    let { notebookName, notebookDescription, notebookTexts, ownedBy } = req.body;
    if (notebookName.length < 3) {
        res.status(449).send('Too short name');
    }

    const user_id = await db.promise().query(`SELECT id FROM users WHERE username='${ownedBy}'`);

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
                        throw new Error(err);
                    } else {
                        if (response?.length == 0) {
                            db.promise().query(`INSERT INTO notebookRecords(notebookName, notebookDescription, notebookTexts, ownedBy, user_id) VALUES('${notebookName}', '${notebookDescription}', '${notebookTexts}', '${ownedBy}', '${user_id[0][0].id}')`)
                            res.status(201).send('Notebook created!')
                        } else {
                            res.status(409).send('Notebook already exists');
                        }
                    }
                })
        } catch(error) {
            throw new Error(error);
        }
    }

})
router.put('/:id', (req, res) => {
    let { notebookName, notebookDescription, notebookTexts } = req.body;

    if (!notebookTexts) {
        res.status(404).send('Notebook not found');
        return;
    }

    db.promise().query(`UPDATE notebookRecords SET notebookName='${notebookName}', notebookDescription='${notebookDescription}', notebookTexts='${notebookTexts}' WHERE notebookName='${notebookName}'`)
    res.status(200).send({ msg: 'Updated' })
})
router.delete('/:id', (req, res) => {
    let { notebookName } = req.body;

    if (!notebookName) {
        res.status(404).send('Id not found');
        return;
    }

    db.promise().query(`DELETE FROM notebookRecords WHERE notebookName='${notebookName}'`);
    res.status(200).send('Notebook deleted successfully');
})
module.exports = router