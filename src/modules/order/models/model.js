'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var OrderSchema = new Schema({
    orderno: {
        type: String,
    },
    customer: {
        firstname: {
            type: String
        },
        lastname: {
            type: String
        },
        tel: {
            type: String
        },
        address: {
            type: String
        }
    },
    items: {
        type: [
            {
                name: {
                    type: String
                },
                option: {
                    type: [
                        {
                            name: {
                                type: String
                            },
                            value: {
                                type: String
                            }
                        }
                    ]
                },
                qty: {
                    type: Number
                },
                price: {
                    type: Number
                },
                amount: {
                    type: Number
                }
            }
        ]
    },
    totalamount: {
        type: Number
    },
    user_id: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    }
});

mongoose.model("Order", OrderSchema);