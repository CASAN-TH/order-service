'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    mq = require('../../core/controllers/rabbitmq'),
    Order = mongoose.model('Order'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    _ = require('lodash');

exports.getList = function (req, res) {
    Order.find(function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: datas
            });
        };
    });
};

exports.create = function (req, res) {
    var newOrder = new Order(req.body);
    var customerData = req.body.customer
    newOrder.createby = req.user;
    newOrder.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var dataSend = {
                customer: customerData,
                userCreate: req.user
            }
            mq.publish('Customer', 'created', JSON.stringify(dataSend));
            res.jsonp({
                status: 200,
                data: data
            });
            /**
             * Message Queue
             */
            // mq.publish('Order', 'created', JSON.stringify(data));
        };
    });
};

exports.mapData = function (req, res, next) {
    req.orders = [];
    req.body.data.forEach(order => {
        if (order.recipientname) {
            let _order = {
                orderno: new Date().getTime(),
                orderstatus: false,
                team_id: 'teamid',
                customer: {
                    firstname: order.recipientname,
                    tel: order.mobile,
                    address: [
                        {
                            houseno: order.address,
                            zipcode: order.postcode
                        }
                    ]
                },
                items: [],
                rewards: [],
                createby: req.user,
                user_id: req.user._id,
                team_id: req.user.ref1
            };
            if (order.mini_01 ||
                order.mini_02 ||
                order.mini_03 ||
                order.mini_04 ||
                order.mini_05 ||
                order.mini_06 ||
                order.mini_07 ||
                order.mini_08 ||
                order.mini_09 ||
                order.mini_10 ||
                order.mini_11 ||
                order.mini_12) {
                _order.items.push({
                    "name": "ลิปมินิ",
                    "price": 0,
                    "totalqty": (order.mini_01 || 0)
                        + (order.mini_02 || 0)
                        + (order.mini_03 || 0)
                        + (order.mini_04 || 0)
                        + (order.mini_05 || 0)
                        + (order.mini_06 || 0)
                        + (order.mini_07 || 0)
                        + (order.mini_08 || 0)
                        + (order.mini_09 || 0)
                        + (order.mini_10 || 0)
                        + (order.mini_11 || 0)
                        + (order.mini_12 || 0),
                    "amount": 0,
                    "option": [{ "name": "เบอร์", "value": [] }]
                });

                if (order.mini_01) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "1",
                        qty: order.mini_01
                    });
                }

                if (order.mini_02) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "2",
                        qty: order.mini_02
                    });
                }

                if (order.mini_03) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "3",
                        qty: order.mini_03
                    });
                }

                if (order.mini_04) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "4",
                        qty: order.mini_04
                    });
                }
                if (order.mini_05) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "5",
                        qty: order.mini_05
                    });
                }
                if (order.mini_06) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "6",
                        qty: order.mini_06
                    });
                }
                if (order.mini_07) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "7",
                        qty: order.mini_07
                    });
                }
                if (order.mini_08) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "8",
                        qty: order.mini_08
                    });
                }
                if (order.mini_09) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "9",
                        qty: order.mini_09
                    });
                }
                if (order.mini_10) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "10",
                        qty: order.mini_10
                    });
                }
                if (order.mini_11) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "11",
                        qty: order.mini_11
                    });
                }
                if (order.mini_12) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "12",
                        qty: order.mini_12
                    });
                }
            }
            if (order.large_01 ||
                order.large_02 ||
                order.large_03 ||
                order.large_04 ||
                order.large_05 ||
                order.large_06 ||
                order.large_07 ||
                order.large_08 ||
                order.large_09 ||
                order.large_10 ||
                order.large_11 ||
                order.large_12
            ) {
                _order.items.push({
                    "name": "ลิป 5 กรัม",
                    "price": 0,
                    "totalqty": (order.large_01 || 0)
                        + (order.large_02 || 0)
                        + (order.large_03 || 0)
                        + (order.large_04 || 0)
                        + (order.large_05 || 0)
                        + (order.large_06 || 0)
                        + (order.large_07 || 0)
                        + (order.large_08 || 0)
                        + (order.large_09 || 0)
                        + (order.large_10 || 0)
                        + (order.large_11 || 0)
                        + (order.large_12 || 0),
                    "amount": 0,
                    "option": [{ "name": "เบอร์", "value": [] }]
                });

                if (order.large_01) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "1",
                        qty: order.large_01
                    });
                }

                if (order.large_02) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "2",
                        qty: order.large_02
                    });
                }

                if (order.large_03) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "3",
                        qty: order.large_03
                    });
                }

                if (order.large_04) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "4",
                        qty: order.large_04
                    });
                }
                if (order.large_05) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "5",
                        qty: order.large_05
                    });
                }
                if (order.large_06) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "6",
                        qty: order.large_06
                    });
                }
                if (order.large_07) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "7",
                        qty: order.large_07
                    });
                }
                if (order.large_08) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "8",
                        qty: order.large_08
                    });
                }
                if (order.large_09) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "9",
                        qty: order.large_09
                    });
                }
                if (order.large_10) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "10",
                        qty: order.large_10
                    });
                }
                if (order.large_11) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "11",
                        qty: order.large_11
                    });
                }
                if (order.large_12) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "12",
                        qty: order.large_12
                    });
                }
            }

            if (order.pub_01 ||
                order.pub_02 ||
                order.pub_03) {
                _order.items.push({
                    "name": "แป้ง cc&long lasting",
                    "price": 0,
                    "totalqty": (order.pub_01 || 0)
                        + (order.pub_02 || 0)
                        + (order.pub_03 || 0),
                    "amount": 0,
                    "option": [{ "name": "เบอร์", "value": [] }]
                });

                if (order.pub_01) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "1",
                        qty: order.pub_01
                    });
                }

                if (order.pub_02) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "2",
                        qty: order.pub_02
                    });
                }

                if (order.pub_03) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "3",
                        qty: order.pub_03
                    });
                }
            }
            if (order.pb_01 ||
                order.pb_02 ||
                order.pb_03) {
                _order.items.push({
                    "name": "แป้ง all in one perfect",
                    "price": 0,
                    "totalqty": (order.pb_01 || 0)
                        + (order.pb_02 || 0)
                        + (order.pb_03 || 0),
                    "amount": 0,
                    "option": [{ "name": "เบอร์", "value": [] }]
                });

                if (order.pb_01) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "1",
                        qty: order.pb_01
                    });
                }

                if (order.pb_02) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "2",
                        qty: order.pb_02
                    });
                }

                if (order.pb_03) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "3",
                        qty: order.pb_03
                    });
                }
            }
            if (order.soappink ||
                order.soaporange) {
                _order.items.push({
                    "name": "สบู่",
                    "price": 0,
                    "totalqty": (order.soappink || 0)
                        + (order.soaporange || 0),
                    "amount": 0,
                    "option": [{ "name": "สี", "value": [] }]
                });

                if (order.soap_pink) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "pink",
                        qty: order.soap_pink
                    });
                }

                if (order.soap_orange) {
                    _order.items[_order.items.length -1].option[0].value.push({
                        name: "orange",
                        qty: order.soap_orange
                    });
                }
            }

            if (order.reward) {
                _order.rewards.push({
                    "name": "**",
                    "price": 0,
                    "totalqty": 1,
                    "amount": 0,
                    "option": [{ "name": "ประเภท", "value": [] }]
                });

                _order.rewards[_order.rewards.length -1].option[0].value.push({
                    name: order.reward,
                    qty: 1
                });
            }

            if (order.codamount) {
                _order.paymenttype = {
                    name: "ปลายทาง"
                };
                _order.totalamount = order.codamount;
            } else {
                _order.paymenttype = {
                    name: "โอนแล้ว"
                };
                _order.totalamount = 0;
            }

            req.orders.push(_order);
        }

    });
    next();
}

exports.importData = function (req, res) {
    Order.insertMany(
        req.orders,
        {
            ordered: false
        },
        function (err, data) {
            if (err) {
                return res.status(401).send({
                    status: 401,
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp({
                    status: 200,
                    data: data
                });
            }
        }
    );
}

exports.getByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Order.findById(id, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data ? data : {};
            next();
        };
    });
};

exports.read = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.data ? req.data : []
    });
};

exports.update = function (req, res) {
    var updOrder = _.extend(req.data, req.body);
    updOrder.updated = new Date();
    updOrder.updateby = req.user;
    updOrder.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.delete = function (req, res) {
    req.data.remove(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.generateOrderNo = function (req, res, next) {
    if (req.body) {
        // var newDate = new Date();
        //  req.newDate = newDate;
        // var textDate =  newDate.getFullYear().toString().substring(2, 4) + ((newDate.getMonth() + 1) < 10 ? '0' : '') + (newDate.getMonth() + 1).toString() + newDate.getDate().toString();
        req.body.orderno = new Date().getTime();
        next();
    } else {
        return res.status(400).send({
            status: 400,
            message: 'Order not found.'
        });
    }
};

exports.getByUserID = function (req, res, next, user_id) {
    // if (!mongoose.Types.ObjectId.isValid(user_id)) {
    //     return res.status(400).send({
    //         status: 400,
    //         message: 'Id is invalid'
    //     });
    // }

    Order.find({ user_id: user_id, orderstatus: false }, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data ? data : {};
            next();
        };
    });
};

exports.getOrderByTeam = function (req, res, next, id) {

    Order.find({ team_id: id, orderstatus: false }, function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.resualt = datas
            next();
        }
    })

}

exports.updateOrder = function (req, res, next, id) {

    Order.updateMany({ team_id: id }, { $set: { orderstatus: true } }, { upsert: true }, function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            // console.log(datas)
            req.resualt = datas
            next();
        }
    })
}

exports.orderHistory = function (req, res, next, id) {

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(400).send({
    //         status: 400,
    //         message: 'Id is invalid'
    //     });
    // }

    Order.find({ user_id: id, orderstatus: true }, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.resualt = data ? data : {};
            next();
        };
    });
}

exports.returnData = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.resualt
    });
}