const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Utils = require('./../utils')

// schema
const productSchema = new mongoose.Schema({
    productName: {
    type: String,
    required: true
    },
    image: {
    type: String,
    required: true
    },
    description: {
    type: String,
    required: true
    },
    ingredients: {
    type: String,
    required: true
    },
    price: {
    type: Number,
    required: true
    },
    glutenFree: {
    type: Boolean,
    required: true
    },
    nutFree: {
    type: Boolean,
    required: true
    },
    dairyFree: {
    type: Boolean,
    required: true
    },
    vegan: {
    type: Boolean,
    required: true
    },
}, { timestamps: true })

// model
const productModel = mongoose.model('Product', productSchema)

// export
module.exports = productModel