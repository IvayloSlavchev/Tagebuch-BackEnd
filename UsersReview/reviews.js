const { Router } = require('express')
const cors = require('cors');
const db = require('../database.js');
const router = Router();

router.use(cors());

router.use(function (req, res, next) {
    console.log('Request made to /reviews');
    next();
  });
router.get('/', async(req, res) => {
     const reviews = await db.promise().query(`SELECT * FROM reviews`);

    return res.status(200).send(reviews[0])
})

router.post('/', (req, res) => {
    let { username, reviewTitle, userReview } = req.body;

    if(!username || !reviewTitle || !userReview){
        res.status(409).send('User did\'t provide any review');
        return;
    }

    if(username && reviewTitle && userReview){
        try{
            db.promise().query(`INSERT INTO reviews(username, reviewTitle, userReview) VALUES ('${username}', '${reviewTitle}', '${userReview}')`);
            res.status(200).send('Review added successfully!')
        } catch(error){
            res.status(409).send(error);
        }
    }
})

router.put('/:id', (req, res) => {
    let { username, userReview } = req.body;

    db.promise().query(`UPDATE reviews SET userReview='${userReview}' WHERE username='${username}'`);
    res.status(200).send('Comment updated successfully');
})

router.delete('/', (req, res) => {
    let { username, userReview } = req.body;

    if(!username || !userReview){
        res.status(404).send('Not found');
        return;
    }

    db.promise().query(`DELETE FROM reviews WHERE username='${username}' AND userReview='${userReview}'`)
    res.status(200).send('Review deleted successfully');
})

module.exports = router;