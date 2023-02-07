const { Router } = require('express')
const cors = require('cors');
const db = require('../database.js');
const router = Router();
const bodyParser = require('body-parser');

router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }))

router.use(function (req, res, next) {
    console.log('Request made to /reviews');
    next();
});
router.get('/', async (req, res) => {
    const reviews = await db.promise().query(`SELECT * FROM reviews`);

    return res.status(200).send(reviews[0])
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
            res.status(200).send('Review added successfully!')
        } catch (error) {
            res.status(409).send(error);
        }
    }
})

router.delete('/', async (req, res) => {
    let { username, userReview } = req.body;

    if (!username || !userReview) {
        res.status(404).send('Not found');
        return;
    }

    if (username && userReview) {
        try {
            const getUserCommentFromDatabase = await db.promise().query(`SELECT COUNT(userReview) FROM reviews WHERE userReview=?`, [userReview]);

            const isCommentExist = Object.values(getUserCommentFromDatabase[0][0])

            if (isCommentExist == 0) {
                return res.status(404).send('User comment not found');
            }

            db.promise().query(`DELETE FROM reviews WHERE username=? AND userReview=?`, [username, userReview])
            return res.status(200).send('Comment deleted successfully')

        } catch (error) {
            return res.status(404).send(error)
        }
    }

})

module.exports = router;