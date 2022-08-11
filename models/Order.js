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
    products: [
        {type: Schema.ObjectId, ref: 'Product'}
    ],
    total: {
        type: Number,
        required: true,
    },
    orderStatus: {
    type: Boolean
    }   
}, { timestamps: true })

// model
const orderModel = mongoose.model('Order', orderSchema)

// export
module.exports = orderModel