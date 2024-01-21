const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    pageNumber: Number,
    price: Number,
    ISBN: String,
}, {
    versionKey: false,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;

            ret = { id: ret.id, ...ret };

            return ret;
        }
    }
});

module.exports = mongoose.model('Book', BookSchema);