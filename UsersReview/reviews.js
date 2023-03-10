const { Router } = require('express')
const cors = require('cors');
const { db } = require('../database.js');
const router = Router();
const bodyParser = require('body-parser');

router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }))

router.use(function (req, res, next) {
    console.log('Request made to /reviews');
    next();
});
router.get('/', async (req, res) => {
    try {
        const reviews = await db.promise().query(`SELECT * FROM reviews`);

        return res.status(200).send(reviews[0])
    } catch(error) {
        return res.status(400).send('An error occured: ' + error);
    }
})

router.post('/', (req, res) => {
    let { username, reviewTitle, userReview } = req.body;

    if (!username || !reviewTitle || !userReview) {
        res.status(409).send('User did\'t provide any review');
        return;
    }

    if (username && reviewTitle && userReview) {
        try {
            db.promise().query(`INSERT INTO reviews(username, reviewTitle, userReview) VALUES (?, ?, ?)`, [username.trim(), reviewTitle.trim(), userReview.trim()]);
            res.status(200).json({ msg: 'Review added successfully!' })
        } catch (error) {
            res.status(409).json({ msg: error });
        }
    }
})

router.delete('/', async (req, res) => {
    let { username, userReview } = req.body;

    if (!username || !userReview) {
        return res.status(404).json({ msg: 'Not found' });
    }

    if (username && userReview) {
        try {
            const getUserCommentFromDatabase = await db.promise().query(`SELECT COUNT(userReview) FROM reviews WHERE userReview=?`, [userReview]);

            const isCommentExist = Object.values(getUserCommentFromDatabase[0][0])

            if (isCommentExist == 0) {
                return res.status(404).json({ msg: 'User comment not found' });
            }

            db.promise().query(`DELETE FROM reviews WHERE username=? AND userReview=?`, [username, userReview])
            return res.status(200).json({ msg: 'Comment deleted successfully' })

        } catch (error) {
            return res.status(404).json({ msg: error })
        }
    }

})

module.exports = router;