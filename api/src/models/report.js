const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    Datetime: String,
    params: {
        orderStatusToFilter: {
            type: String,
            default: 'all',
        },
        beginDate: String,
        endDate: String,
    },
    type: {
        type: String,
        enum: ['orders', 'profitByOrders'],
    },
    status: {
        type: String,
        default: 'Pending',
    },
    downloadLink: String,
},  {
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

module.exports = mongoose.model('Report', reportSchema);