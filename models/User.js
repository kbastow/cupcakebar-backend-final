// dependencies ---------------------------------------------
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Utils = require('./../utils')
require('mongoose-type-email') 


//schema ---------------------------------------------
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    }, 
    lastName: {
        type: String,
        require: true
    }, 
    email: {
        type: mongoose.SchemaTypes.Email,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    accessLevel: {
        type: Number,
        require: true
    },
    avatar: {
        type: String,
    },
    savedProducts: [
      {type: Schema.ObjectId, ref: 'Product'}
    ],
    userCart: [
        {type: Schema.ObjectId, ref: 'Product'}
    ]
}, {timestamps: true})

// encrypt password field on save
userSchema.pre('save', function(next) {
    // check if password is present and is modifed  
    if( this.password && this.isModified() ){
        this.password = Utils.hashPassword(this.password);
    }
    next()
  })

// create mongoose model ---------------------------------------------
const userModel = mongoose.model('User', userSchema)


//export ---------------------------------------------
module.exports = userModel