const express = require('express');
const router = express.Router();
const Order = require('../models/order.js');
const OrderBook = require('../models/orderBook.js');
const book = require('../models/book.js');
const auth = require('../middleware/auth.js');
const limit = 15;

router.get('/orders', async (req, res) => {
    const orderList = await Order.find().limit(limit).populate('user', 'username').sort({ createdAt : -1 });

    if (!orderList) {
        res.status(500).json({ success: false })
    }
        res.header('Access-Control-Expose-Headers', 'X-Total-Count', 'Content-Range');
        res.header('X-Total-Count', orderList.length);
        res.set('Content-Range', `order 0-${limit-1}/${orderList.length}`);
    res.send(orderList);
});

router.get('/orders/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
    .populate('user', 'username')
    .populate({ path: 'orderBooks', populate: 'book'});

    if (!order) {
        res.status(500).json({ success: false })
    }

    res.send(order);
});

/*router.post('/orders', async (req, res) => {
    try {
        const existingBook = await book.findOne({
            ISBN: req.body.ISBN
        })


        if (existingBook) {
            const orderBooks = req.body.orderBooks.map(orderBook => {
                // Burada kitap fiyatını ve miktarını kullanarak total fiyatı hesapla
                const bookTotalPrice = existingBook.price * orderBook.quantity;

                // Hesaplanan total fiyat ile orderBook nesnesini güncelle
                return {
                    book: existingBook._id,
                    quantity: orderBook.quantity,
                    totalPrice: bookTotalPrice
                };
            });

            const totalPrice = orderBooks.reduce((acc, orderBook) => acc + orderBook.totalPrice, 0);

            const order = new Order({
                user: req.body.user,
                orderBooks: orderBooks,
                status: req.body.status,
                totalPrice: totalPrice,
            });

            await order.save();
            res.status(201).json({ message: 'Order created successfully', order: order });
        } else {
            return res.status(409).json({ message: 'Book with given ISBN does not exist' });
        }
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    
});*/

router.post('/orders', async (req, res) => {
    const orderBooksIds = Promise.all(req.body.orderBooks.map(async (orderBook) => {
        let newOrderBook = new OrderBook({
            book: orderBook.book,
            quantity: orderBook.quantity
        });

        newOrderBook = await newOrderBook.save();

        return newOrderBook._id;
    }));
    const orderBookIdsResolved = await orderBooksIds;

    const totalPrices = await Promise.all(orderBookIdsResolved.map(async (orderBookId) => {
        const orderItem = await OrderBook.findById(orderBookId).populate('book', 'price');
        const totalPrice = orderItem.book.price * orderItem.quantity;
        return totalPrice;
    }));

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    
    let order = new Order({
        user: req.body.user,
        orderBooks: orderBookIdsResolved,
        status: req.body.status,
        totalPrice: totalPrice,
    });

    order = await order.save();

    if (!order) {
        return res.status(404).send('The order cannot be created')
    }

    res.send(order);
});

router.put('/orders/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status,
        },
        { new: true }
    );

    if (!order) {
        return res.status(404).send('The order cannot be updated')
    }

    res.send(order);
});

router.delete('/orders/:id', (req, res) => {
    Order.findByIdAndDelete(req.params.id)
        .then(async order => {
            if (order) {
                await order.orderBooks.map(async (bookItem) => {
                    await OrderBook.findByIdAndDelete(bookItem);
                });
                return res.status(200).json({ success: true, message: 'The order is deleted!' })
            } else {
                return res.status(404).json({ success: false, message: "Order not found!" })
            }
        }).catch((err) => {
            return res.status(500).json({ success: false, error: err })
        })
});

router.get('/orders/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
    ]);

    if (!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({ totalsales: totalSales.pop().totalsales });
});

router.get('/orders/get/count', async (req, res) => {
    try {
        const orderCount = await Order.countDocuments({});

        if (!orderCount) {
            res.status(500).json({ success: false });
        }

        res.send({
            orderCount: orderCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/orders/get/userorders/:userid', async (req, res) => {
    const userOrderList = await Order.find({ user: req.params.userid })
        .populate({
            path: 'orderBooks', populate: {
                path: 'book',
            }
        }).sort({ 'dateOrdered': -1 });

    if (!userOrderList) {
        res.status(500).json({ success: false })
    }

    res.send(userOrderList);
});

module.exports = router;