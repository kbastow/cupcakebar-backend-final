const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Utils = require('./../utils')

// schema
const orderSchema = new mongoose.Schema({
    user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
    },
    orderSummary: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
    },
    orderStatus: {
    type: Boolean
    }   
}, { timestamps: true })

// model
const orderModel = mongoose.model('Order', orderSchema)

// export
module.exports = orderModel