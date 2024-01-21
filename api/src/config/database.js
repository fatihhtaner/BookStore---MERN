const mongoose = require('mongoose');
const dotenv = require('dotenv');

const db = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Connected to the database!");
    }).catch((err) => {
        console.log("Cannot connect to the database!", err);
    })
}

module.exports = db