const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
    },
    orderBooks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrderBook',
            required: true,
        }
    ],
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Canceled', 'Shipped', 'Completed'],
        default: 'Pending',
    },
    totalPrice: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
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

module.exports = mongoose.model('Order', orderSchema);
