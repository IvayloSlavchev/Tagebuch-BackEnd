const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const users = require('./Users/users.js');
const notebookRecords = require('./NotebookRecords/notebookRecords.js');
const reviews = require('./UsersReview/reviews.js');

dotenv.config();

let port = process.env.PORT || 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/users', users);
app.use('/notebookrecords', notebookRecords);
app.use('/reviews', reviews)
app.use(cors());

app.listen(port, () => console.log(`Server is listening to ${port}`));
