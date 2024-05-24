// Create web server
// npm install express
const express = require('express');
const app = express();

// npm install body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// npm install cors
const cors = require('cors');
app.use(cors());

// npm install mongodb
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb://localhost:27017/';

// npm install nodemon -g
// nodemon comments.js
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Create a new comment
app.post('/comments', (req, res) => {
    MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, db) => {
        if (err) {
            res.status(500).send('Error connecting to database');
            return;
        }
        const dbo = db.db('blog');
        const comment = req.body;
        dbo.collection('comments').insertOne(comment, (err, result) => {
            if (err) {
                res.status(500).send('Error inserting comment');
                db.close();
                return;
            }
            res.status(201).send('Comment created');
            db.close();
        });
    });
});

// Get all comments
app.get('/comments', (req, res) => {
    MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, db) => {
        if (err) {
            res.status(500).send('Error connecting to database');
            return;
        }
        const dbo = db.db('blog');
        dbo.collection('comments').find({}).toArray((err, result) => {
            if (err) {
                res.status(500).send('Error getting comments');
                db.close();
                return;
            }
            res.send(result);
            db.close();
        });
    });
});

// Get a comment by its id
app.get('/comments/:id', (req, res) => {
    MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, db) => {
        if (err) {
            res.status(500).send('Error connecting to database');
            return;
        }
        const dbo = db.db('blog');
        const id = new mongodb.ObjectID(req.params.id);
        dbo.collection('comments').findOne({ _id: id }, (err, result) => {
            if (err)