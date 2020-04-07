process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');
const {connect, close, app}= require('../../../app.js');
const Category = require('../../../models/Category');

describe('Test /categories', function() {
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

        afterEach(async () => {
            await Category.remove();
        })

        it('Empty, calling an initial get request', (done) => {
            request(app).get('/categories')
              .then((res) => {
                const body = res.body;
                expect(body.length).to.equal(0);
                done();
              })
              .catch((err) => done(err));
          });

          it('OK, posting a category', (done) => {
            request(app).post('/categories')
            .type('json')
            .send({ name: "test" })
            .then((res) => {
                expect(res.status).to.equal(200);
                done();
            })
          .catch((err) => done(err));
        });

        it('Bad request error, category requires name', (done) => {
          request(app).post('/categories')
          .send({ })
          .then((res) => {
              expect(res.status).to.equal(400);
              done();
          })
        .catch((err) => done(err));
      });
      
        it('OK, getting the category', (done) => {
          request(app).post('/categories')
          .type('json')
          .send({ name: "test" })
          .then((res) => {
            expect(res.status).to.equal(200);
            request(app).get('/categories')
            .then((res) => {
              const body = res.body;
              expect(body.length).to.equal(1);
              done();
            })  
          })
        .catch((err) => done(err));
      });

      it('OK, deleting a category', (done) => {
        request(app)
        .post('/categories')
        .type('json')
        .send({ name: "carpets" })
        .then((res) => {
            expect(res.status).to.equal(200);
            request(app).get('/categories')
            .then((res) => {
              expect(res.body.length).to.equal(1);
              request(app)
              .delete(`/categories/${res.body[0]._id}`)
              .then((res) => {
                expect(res.status).to.equal(200);
                done();
               }); 
            });
        })
      .catch((err) => done(err));
    });

    it('OK, updating a category', (done) => {
      request(app)
      .post('/categories')
      .type('json')
      .send({ name: "games" })
      .then((res) => {
          expect(res.status).to.equal(200);
          request(app).get('/categories')
          .then((res) => {
            expect(res.body.length).to.equal(1);
            request(app).patch(`/categories/${res.body[0]._id}`)
            .send({name: "updated"})
            .then((res) => {
              expect(res.status).to.equal(200);
              request(app).get('/categories')
                .then((res) => {
                  expect(res.body.length).to.equal(1);
                  done();
                });
             }); 
          });
      })
    .catch((err) => done(err));
  });
});

