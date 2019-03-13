'use strict';
var controller = require('../controllers/controller'),
    mq = require('../../core/controllers/rabbitmq'),
    policy = require('../policy/policy');
module.exports = function (app) {
    var url = '/api/orders';
    var urlWithParam = '/api/orders/:orderId';
    app.route(url).all(policy.isAllowed)
        .get(controller.getList)
        .post(
            controller.generateOrderNo,
            controller.create
        );

    app.route(urlWithParam).all(policy.isAllowed)
        .get(controller.read)
        .put(controller.update)
        .delete(controller.delete);

    app.param('orderId', controller.getByID);

    /**
     * Message Queue
     * exchange : ชื่อเครือข่ายไปรษณีย์  เช่น casan
     * qname : ชื่อสถานีย่อย สาขา
     * keymsg : ชื่อผู้รับ
     */
    // mq.consume('order', 'created', 'created', (msg)=>{
    //     console.log(JSON.parse(msg.content));

    // });
}