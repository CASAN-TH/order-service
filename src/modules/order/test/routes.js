'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Order = mongoose.model('Order');

var credentials,
    token,
    mockup;

describe('Order CRUD routes tests', function () {

    before(function (done) {
        mockup = {

            customer: {
                firstname: 'Nutshapon',
                lastname: 'Lertlaosakun',
                tel: '025337172',
                address: '59/337 ต.คูคต อ.ลำลูกกา จ.ปทุมธานี'
            },
            items: [
                {
                    name: 'ลิปติก',
                    option: [
                        {
                            name: 'สี',
                            value: 'แดง'
                        }
                    ],
                    qty: 2,
                    price: 100,
                    amount: 200
                }
            ],
            totalamount: 200
        };
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user']
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be Order get use token', (done) => {
        request(app)
            .get('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                done();
            });
    });

    it('should be Order get by id', function (done) {

        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/orders/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        // console.log(resp);
                        assert.equal(resp.status, 200);
                        assert.notEqual(resp.data.orderno, "");
                        assert.equal(resp.data.customer.firstname, mockup.customer.firstname);
                        assert.equal(resp.data.customer.lastname, mockup.customer.lastname);
                        assert.equal(resp.data.customer.tel, mockup.customer.tel);
                        assert.equal(resp.data.items[0].name, mockup.items[0].name);
                        assert.equal(resp.data.items[0].option[0].name, mockup.items[0].option[0].name);
                        assert.equal(resp.data.items[0].option[0].value, mockup.items[0].option[0].value);
                        assert.equal(resp.data.items[0].qty, mockup.items[0].qty);
                        assert.equal(resp.data.items[0].price, mockup.items[0].price);
                        assert.equal(resp.data.items[0].amount, mockup.items[0].amount);
                        assert.equal(resp.data.totalamount, mockup.totalamount);
                        done();
                    });
            });

    });

    it('should be Order post use token', (done) => {
        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.status, 200);
                assert.notEqual(resp.data.orderno, "");
                assert.equal(resp.data.customer.firstname, mockup.customer.firstname);
                assert.equal(resp.data.customer.lastname, mockup.customer.lastname);
                assert.equal(resp.data.customer.tel, mockup.customer.tel);
                assert.equal(resp.data.items[0].name, mockup.items[0].name);
                assert.equal(resp.data.items[0].option[0].name, mockup.items[0].option[0].name);
                assert.equal(resp.data.items[0].option[0].value, mockup.items[0].option[0].value);
                assert.equal(resp.data.items[0].qty, mockup.items[0].qty);
                assert.equal(resp.data.items[0].price, mockup.items[0].price);
                assert.equal(resp.data.items[0].amount, mockup.items[0].amount);
                assert.equal(resp.data.totalamount, mockup.totalamount);
                done();
            });
    });

    it('should be order put use token', function (done) {

        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    orderno: 'orderno update'
                }
                request(app)
                    .put('/api/orders/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.notEqual(resp.data.orderno, "");
                        assert.equal(resp.data.customer.firstname, mockup.customer.firstname);
                        assert.equal(resp.data.customer.lastname, mockup.customer.lastname);
                        assert.equal(resp.data.customer.tel, mockup.customer.tel);
                        assert.equal(resp.data.items[0].name, mockup.items[0].name);
                        assert.equal(resp.data.items[0].option[0].name, mockup.items[0].option[0].name);
                        assert.equal(resp.data.items[0].option[0].value, mockup.items[0].option[0].value);
                        assert.equal(resp.data.items[0].qty, mockup.items[0].qty);
                        assert.equal(resp.data.items[0].price, mockup.items[0].price);
                        assert.equal(resp.data.items[0].amount, mockup.items[0].amount);
                        assert.equal(resp.data.totalamount, mockup.totalamount);
                        done();
                    });
            });

    });

    it('should be order delete use token', function (done) {

        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/orders/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be order get not use token', (done) => {
        request(app)
            .get('/api/orders')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    it('should be order post not use token', function (done) {

        request(app)
            .post('/api/orders')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be order put not use token', function (done) {

        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    orderno: 'orderno update'
                }
                request(app)
                    .put('/api/orders/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be order delete not use token', function (done) {

        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/orders/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Order.remove().exec(done);
    });

});