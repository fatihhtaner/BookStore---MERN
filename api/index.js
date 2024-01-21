const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/config/database.js')
const Book = require('./src/routes/book.js')
const Auth = require('./src/routes/auth.js')
const Order = require('./src/routes/order.js')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./src/swagger/swagger.json');
const Report = require('./src/routes/report.js')
const auth = require('./src/middleware/auth.js')

const app = express();

app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));


const options = {
    definition: swaggerOptions,
    apis: ['./routes/*.js'],
}

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
    cors({
    credentials: true,
    exposedHeaders: ['Content-Range'],
    })
);

/*app.use((req, res, next) => {
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    console.log(req.headers)
    next();
});*/

app.use('/', Auth);

app.use('/', Book);

app.use('/', Order);

app.use('/', Report);

const PORT = process.env.PORT || 5000;

db();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})

module.exports = app;