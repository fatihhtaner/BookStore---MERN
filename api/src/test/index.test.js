const request = require('supertest');
const app = require('../../index.js');
const Book = require('../../src/models/book.js');

describe('Books API', () => {
    let createdBookId;

    beforeEach((done) => {
        console.log('Creating a test book');
        const testBook = new Book({
            title: 'Test Book',
            author: 'Test Author',
            pageNumber: 123,
            price: 10,
            ISBN: 'TESTISBN',
        })

        testBook.save()
            .then(book => {
                testBookId = book.id;
                done();
            })
            .catch(err => done(err));
    })

    afterEach((done) => {
        console.log('Deleting the test book');
        Book.findByIdAndDelete(testBookId)
            .then(() => done())
            .catch(err => done(err));
    });

    describe('GET /books', () => {
        it('GET /books', async () => {
            return request(app)
            .get('/books')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            title: expect.any(String),
                            author: expect.any(String),
                            pageNumber: expect.any(Number),
                            price: expect.any(Number),
                            ISBN: expect.any(String),
                        }),
                    ])
                );
            })
        })
    
        describe('GET /books/:id', () => {
            it('Should return 200', async () => {
                return request(app)
                .get(`/books/${testBookId}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            title: expect.any(String),
                            author: expect.any(String),
                            pageNumber: expect.any(Number),
                            price: expect.any(Number),
                            ISBN: expect.any(String),
                        })
                    );
                })
            })
        });
    });

    describe('GET /books/:id', () => {
        it('Should return a 404 error', async () => {
            const invalidID = '123456789012';
            return request(app)
            .get(`/books/${invalidID}`)
            .expect('Content-Type', /json/)
            .expect(404)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        message: expect.any(String),
                    })
                );
            })
        });
    });  

    describe('POST /books', () => {
        it('POST /books', async () => {
            return (
                request(app)
                .post('/books')
                .send({
                    title: 'Test Book3',
                    author: 'Test Author3',
                    pageNumber: 123,
                    price: 10,
                    ISBN: 'TESTISBN3',
                })
                .expect('Content-Type', /json/)
                .expect(201)
                .then((response) => {
                    createdBookId = response.body._id;
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            title: 'Test Book3',
                            author: 'Test Author3',
                            pageNumber: 123,
                            price: 10,
                            ISBN: 'TESTISBN3',
                        })
                    )
                })
            )
        })
    });

    describe('PUT /books/:id', () => {
        it('PUT /books/:id', async () => {
            return (
                request(app)
                .put('/books/6565f0ea61a1b83e8cf7898e')
                .send({
                    title: 'Test Book1',
                    author: 'Test Author1',
                    pageNumber: 123,
                    price: 11,
                    ISBN: 'TESTISBN1',
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            title: expect.any(String),
                            author: expect.any(String),
                            pageNumber: expect.any(Number),
                            price: expect.any(Number),
                            ISBN: expect.any(String),
                        })
                    )
                })
            )
        })
    });

    describe('USERS', () => {
        it('GET /users', async () => {
            return request(app)
            .get('/users')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            username: expect.any(String),
                            email: expect.any(String),
                            password: expect.any(String),
                            role: expect.any(String),
                            id: expect.any(String),
                        }),
                    ])
                );
            })
        })

        it('GET /users/:id', async () => {
            return request(app)
            .get('/users/6560c5d13304368ea79cd740')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        email: expect.any(String),
                        password: expect.any(String),
                        role: expect.any(String),
                        id: expect.any(String),
                    })
                );
            })
        })
    })

    describe('ORDERS', () => {
        /*it('GET /orders/get/totalsales', async () => {
            return request(app)
            .get('/orders/get/totalsales')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        totalSales: expect.any(Number),
                    })
                );
            })
        })*/

        it('GET /orders/get/count', async () => {
            return request(app)
            .get('/orders/get/count')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        orderCount: expect.any(Number),
                    })
                );
            })
        })
    });
});