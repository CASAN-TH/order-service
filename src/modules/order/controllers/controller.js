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

    Order.find({ user_id: user_id }, function (err, data) {
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

    Order.find({ team_id: id }, function (err, datas) {
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
            console.log(datas)
            req.resualt = datas
            next();
        }
    })
}

exports.returnData = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.resualt
    });
}