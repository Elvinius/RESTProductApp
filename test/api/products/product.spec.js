process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');
const {connect, close, app}= require('../../../app.js');
const Category = require('../../../models/Category');
const Product = require('../../../models/Product');

describe('Test /categories/:categoryId/products', function() {
        before(function (done) {
            console.log('Connecting');
            connect()
            .then(() => done())
            .catch(err => done(err));
        })
      
        after(function(done) {
          close()
            .then(() => done())
            .catch((err) => done(err));
        })

        beforeEach(async () => {
            await Product.remove();
        })

        afterEach(async () => {
            await Category.remove();
        })

        it('OK, getting the products', (done) => {
            request(app).post('/categories')
            .type('json')
            .send({ name: "test" })
            .then((res) => {
              expect(res.status).to.equal(200);
              request(app).get('/categories')
                .then((res) => {
                  expect(res.body.length).to.equal(1);
                  request(app)
                  .post(`/categories/${res.body[0]._id}/products`)
                  .send({name: "tests"})
                  .then((res2) => {
                    expect(res2.status).to.equal(200);
                    request(app)
                    .get(`/categories/${res.body[0]._id}/products`)
                    .then((res) => {
                        expect(res.body.length).to.equal(1);
                        done();
                      });
                  });  
              });  
            })
            .catch((err) => done(err));
        });

        it('OK, posting a product', (done) => {
            request(app).post('/categories')
            .type('json')
            .send({ name: "category" })
            .then((res) => {
              expect(res.status).to.equal(200);
              request(app).get('/categories')
                .then((res) => {
                  expect(res.body.length).to.equal(1);
                  request(app)
                  .post(`/categories/${res.body[0]._id}/products`)
                  .send({name: "products"})
                  .then((res2) => {
                    expect(res2.status).to.equal(200);
                    done();
                  });  
              });  
            })
            .catch((err) => done(err));
        });

        it('OK, deleting a product', (done) => {
            request(app).post('/categories')
            .type('json')
            .send({ name: "test" })
            .then((res) => {
              expect(res.status).to.equal(200);
              request(app).get('/categories')
                .then((res) => {
                  expect(res.body.length).to.equal(1);
                  request(app)
                  .post(`/categories/${res.body[0]._id}/products`)
                  .send({name: "tests"})
                  .then((res2) => {
                    expect(res2.status).to.equal(200);
                    request(app)
                    .get(`/categories/${res.body[0]._id}/products`)
                    .then((res3) => {
                        expect(res.body.length).to.equal(1);
                        request(app)
                        .delete(`/categories/${res.body[0]._id}/products/${res3.body[0]._id}`)
                        .then((res3) => {
                          expect(res3.status).to.equal(200);
                          done();
                    });
                  });  
                }); 
              }); 
            })
            .catch((err) => done(err));
        });

        it('OK, updating a product', (done) => {
            request(app).post('/categories')
            .type('json')
            .send({ name: "test2" })
            .then((res) => {
              expect(res.status).to.equal(200);
              request(app).get('/categories')
                .then((res) => {
                  expect(res.body.length).to.equal(1);
                  request(app)
                  .post(`/categories/${res.body[0]._id}/products`)
                  .send({name: "tests2"})
                  .then((res2) => {
                    expect(res2.status).to.equal(200);
                    request(app)
                    .get(`/categories/${res.body[0]._id}/products`)
                    .then((res3) => {
                        expect(res.body.length).to.equal(1);
                        request(app)
                        .patch(`/categories/${res.body[0]._id}/products/${res3.body[0]._id}`)
                        .send({name:"updated"})
                        .then((res3) => {
                          expect(res3.status).to.equal(200);
                          request(app)
                          .get(`/categories/${res.body[0]._id}/products`)
                          .then((res3) => {
                            expect(res3.body.length).to.equal(1);
                            done();
                        });   
                    });
                  });  
                }); 
              }); 
            })
            .catch((err) => done(err));
        });
});

