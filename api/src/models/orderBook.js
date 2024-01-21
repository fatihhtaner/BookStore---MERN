const mongoose = require('mongoose');

const orderBookSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
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

module.exports = mongoose.model('OrderBook', orderBookSchema);