const express = require('express');
const router = express.Router();
const Book = require('../models/book.js');
const auth = require('../middleware/auth.js');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Order = require('../models/order.js');

const limit = 10;

router.get('/books', async (req, res) => {
    try {
        const books = await Book.find().limit(limit);
        res.header('Access-Control-Expose-Headers', 'X-Total-Count', 'Content-Range');
        res.header('X-Total-Count', books.length);
        res.set('Content-Range', `books 0-${limit-1}/${books.length}`);
        res.status.send("OK");
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.get('/books/:id', (req, res) => {
    Book.findById(req.params.id)
        .then((book) => { res.json(book) })
        .catch((error) => { res.status(404).json({ message: error.message }) });
});

router.post('/books', auth, async (req, res) => {
    try {

        const existingBook = await Book.findOne({
            ISBN: req.body.ISBN
        });

        if (existingBook) {

            return res.status(409).json({ message: 'Book with given ISBN is already exist' });
        }

        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            pageNumber: req.body.pageNumber,
            price: req.body.price,
            ISBN: req.body.ISBN,
        });

        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/books/:id', auth, (req, res) => {
    Book.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        author: req.body.author,
        pageNumber: req.body.pageNumber,
        price: req.body.price,
        ISBN: req.body.ISBN,
    })
        .then((book) => { res.json(book) })
        .catch((error) => { res.json({ message: error.message }) });

});

router.delete('/books/:id', auth, (req, res) => {
    Book.findByIdAndDelete(req.params.id)
        .then((book) => { res.send(book) })
        .catch((error) => { res.json({ message: error.message }) });
});

router.get('/books/author', auth, (req, res) => {
    Book.find({ author: req.query.author })
        .then((books) => { res.json(books) })
        .catch((error) => { res.json({ message: error.message }) });
});


module.exports = router;