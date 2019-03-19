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
                address: [
                    {
                        houseno: "55/7",
                        village: "casa-city",
                        street: "lumlukka Road",
                        subdistrict: "บึงคำพร้อย",
                        district: "lumlukka",
                        province: "phathumthani",
                        zipcode: "12150"
                    }
                ]
            },
            items: [
                {
                    name: 'ลิปติก',
                    option: [
                        {
                            name: 'สี',
                            value: [{
                                name: '#01',
                                qty: 2,
                            }],
                        }
                    ],
                    price: 100,
                    amount: 200
                }
            ],
            totalamount: 200,
            user_id: "user001",
            paymenttype:
            {
                name: "ปลายทาง"
            }
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
                        assert.equal(resp.data.items[0].option[0].value[0].name, mockup.items[0].option[0].value[0].name);
                        assert.equal(resp.data.items[0].option[0].value[0].qty, mockup.items[0].option[0].value[0].qty);
                        assert.equal(resp.data.items[0].price, mockup.items[0].price);
                        assert.equal(resp.data.items[0].amount, mockup.items[0].amount);
                        assert.equal(resp.data.totalamount, mockup.totalamount);
                        assert.equal(resp.data.user_id, mockup.user_id);
                        assert.equal(resp.data.paymenttype.name, mockup.paymenttype.name);
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
                assert.equal(resp.data.items[0].option[0].value[0].name, mockup.items[0].option[0].value[0].name);
                assert.equal(resp.data.items[0].option[0].value[0].qty, mockup.items[0].option[0].value[0].qty);
                assert.equal(resp.data.items[0].price, mockup.items[0].price);
                assert.equal(resp.data.items[0].amount, mockup.items[0].amount);
                assert.equal(resp.data.totalamount, mockup.totalamount);
                assert.equal(resp.data.user_id, mockup.user_id);
                assert.equal(resp.data.paymenttype.name, mockup.paymenttype.name);
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
                        assert.equal(resp.data.items[0].option[0].value[0].name, mockup.items[0].option[0].value[0].name);
                        assert.equal(resp.data.items[0].option[0].value[0].qty, mockup.items[0].option[0].value[0].qty);
                        assert.equal(resp.data.items[0].price, mockup.items[0].price);
                        assert.equal(resp.data.items[0].amount, mockup.items[0].amount);
                        assert.equal(resp.data.totalamount, mockup.totalamount);
                        assert.equal(resp.data.paymenttype.name, mockup.paymenttype.name);
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

    it('this should get order by user_id', function (done) {
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

                var user_id = {
                    user_id: 'user001'
                }
                request(app)
                    .get('/api/order/user/' + user_id.user_id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.notEqual(resp.data[0].orderno, "");
                        assert.equal(resp.data[0].customer.firstname, mockup.customer.firstname);
                        assert.equal(resp.data[0].customer.lastname, mockup.customer.lastname);
                        assert.equal(resp.data[0].customer.tel, mockup.customer.tel);
                        assert.equal(resp.data[0].items[0].name, mockup.items[0].name);
                        assert.equal(resp.data[0].items[0].option[0].name, mockup.items[0].option[0].name);
                        // assert.equal(resp.data[0].items[0].option[0].value, mockup.items[0].option[0].value);
                        // assert.equal(resp.data[0].items[0].option[0].qty, mockup.items[0].option[0].qty);
                        assert.equal(resp.data[0].items[0].price, mockup.items[0].price);
                        assert.equal(resp.data[0].items[0].amount, mockup.items[0].amount);
                        assert.equal(resp.data[0].totalamount, mockup.totalamount);
                        assert.equal(resp.data[0].user_id, user_id.user_id);
                        assert.equal(resp.data[0].paymenttype.name, mockup.paymenttype.name);
                        done();
                    })
            })
    });

    it('this should get order by team', function (done) {
        var order1 = new Order({
            customer: {
                firstname: 'Nutshapon',
                lastname: 'Lertlaosakun',
                tel: '025337172',
                address: [
                    {
                        houseno: "55/7",
                        village: "casa-city",
                        street: "lumlukka Road",
                        subdistrict: "บึงคำพร้อย",
                        district: "lumlukka",
                        province: "phathumthani",
                        zipcode: "12150"
                    }
                ]
            },
            items: [
                {
                    name: 'ลิปติก',
                    option: [
                        {
                            name: 'สี',
                            value: [{
                                name: '#01',
                                qty: 2,
                            }],
                        }
                    ],
                    price: 100,
                    amount: 200
                }
            ],
            totalamount: 200,
            user_id: "user001",
            paymenttype:
            {
                name: "ปลายทาง"
            }

        });
        var order2 = new Order({
            customer: {
                firstname: 'ponlawath',
                lastname: 'changkeb',
                tel: '0553568978',
                address: [
                    {
                        houseno: "55/7",
                        village: "casa-city",
                        street: "lumlukka Road",
                        subdistrict: "บึงคำพร้อย",
                        district: "lumlukka",
                        province: "phathumthani",
                        zipcode: "12150"
                    }
                ]
            },
            items: [
                {
                    name: 'แป้ง',
                    option: [
                        {
                            name: 'สี',
                            value: [{
                                name: '#01',
                                qty: 2,
                            }],
                        }
                    ],
                    price: 70,
                    amount: 50
                }
            ],
            totalamount: 280,
            user_id: "user002",
            paymenttype:
            {
                name: "ปลายทาง"
            }

        })
        var order3 = new Order({
            customer: {
                firstname: 'nutnut',
                lastname: 'lertlao',
                tel: '05359876',
                address: [
                    {
                        houseno: "55/7",
                        village: "casa-city",
                        street: "lumlukka Road",
                        subdistrict: "บึงคำพร้อย",
                        district: "lumlukka",
                        province: "phathumthani",
                        zipcode: "12150"
                    }
                ]
            },
            items: [
                {
                    name: 'ลิปติก',
                    option: [
                        {
                            name: 'สี',
                            value: [{
                                name: '#01',
                                qty: 2,
                            }],
                     
                        }
                    ],
                    price: 100,
                    amount: 150
                }
            ],
            totalamount: 500,
            user_id: "user003",
            paymenttype:
            {
                name: "ปลายทาง"
            }

        })

        order1.save(function (err, ord1) {
            order2.save(function (err, ord2) {
                order3.save(function (err, ord3) {
                    if (err) {
                        return done(err)
                    }
                    var teammember = [order1.user_id, order3.user_id]
                    request(app)
                        .post('/api/order/team')
                        .set('Authorization', 'Bearer ' + token)
                        .send(teammember)
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }
                            var resp = res.body;
                            // console.log(resp);
                            assert.equal(resp.data[0].user_id, order1.user_id)
                            assert.equal(resp.data[0].totalamount, order1.totalamount)
                            assert.equal(resp.data[0].paymenttype.name, order1.paymenttype.name)
                            assert.equal(resp.data[0].customer.firstname, order1.customer.firstname)
                            assert.equal(resp.data[0].customer.lastname, order1.customer.lastname)
                            assert.equal(resp.data[0].customer.tel, order1.customer.tel)
                            assert.equal(resp.data[0].customer.address[0].houseno, order1.customer.address[0].houseno)
                            assert.equal(resp.data[0].items[0].name, order1.items[0].name)
                            // assert.equal(resp.data[0].items[0].option[0].qty, order1.items[0].option[0].qty)
                            assert.equal(resp.data[0].items[0].price, order1.items[0].price)
                            assert.equal(resp.data[0].items[0].amount, order1.items[0].amount)
                            assert.equal(resp.data[1].user_id, order3.user_id)
                            assert.equal(resp.data[1].totalamount, order3.totalamount)
                            assert.equal(resp.data[1].paymenttype.name, order1.paymenttype.name)
                            assert.equal(resp.data[1].customer.firstname, order3.customer.firstname)
                            assert.equal(resp.data[1].customer.lastname, order3.customer.lastname)
                            assert.equal(resp.data[1].customer.tel, order3.customer.tel)
                            assert.equal(resp.data[1].customer.address[0].houseno, order3.customer.address[0].houseno)
                            assert.equal(resp.data[1].items[0].name, order3.items[0].name)
                            // assert.equal(resp.data[1].items[0].option[0].qty, order3.items[0].option[0].qty)
                            assert.equal(resp.data[1].items[0].price, order3.items[0].price)
                            assert.equal(resp.data[1].items[0].amount, order3.items[0].amount)

                            done();
                        });
                })
            })
        })
    });

    afterEach(function (done) {
        Order.remove().exec(done);
    });

});