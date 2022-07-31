// user routes ---------------------------------------------
const express = require("express")
const router = express.Router()
const User = require("./../models/User")
const Utils = require('./../utils')
const path = require('path')


// PUT - add to savedProducts --------------------------------------

router.put('/addSavedProducts/', Utils.authenticateToken, (req, res) => {  
    // validate check
    if(!req.body.productId){
      return res.status(400).json({
        message: "No product specified"
      })
    }
    // add productId to savedProducts field (array - push)
    User.updateOne({
      _id: req.user._id
    }, {
      $push: {
        savedProducts: req.body.productId
      }
    })
      .then((user) => {            
        res.json({
          message: "Product saved to favourites"
        })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: "Problem saving to favourites"
        })
      })
})

// PUT - add to userCart --------------------------------------

router.put('/addToCart/', Utils.authenticateToken, (req, res) => {  
  // validate check
  if(!req.body.productId){
    return res.status(400).json({
      message: "No product specified"
    })
  }
  // add productId to userCart field (array - push)
  User.updateOne({
    _id: req.user._id
  }, {
    $push: {
      userCart: req.body.productId
    }
  })
    .then((user) => {            
      res.json({
        message: "Added to cart"
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem adding to cart"
      })
    })
})

// GET - get single user -------------------------------------------------------

router.get('/:id', Utils.authenticateToken, (req, res) => {
    if(req.user._id != req.params.id){
      return res.status(401).json({
        message: "Not authorised"
      })
    }
  
    User.findById(req.params.id).populate('savedProducts', 'userCart')
      .then(user => {
        res.json(user)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: "Couldn't get user",
          error: err
        })
      })
  })


// PUT - update user ---------------------------------------------

router.put('/:id', Utils.authenticateToken, (req, res) => {
    // validate request
    if(!req.body) return res.status(400).send("Task content can't be empty")

    // Update password
    // 

    let avatarFilename = null
      // if avatar image exists, upload!
      if(req.files && req.files.avatar){
        // upload avater image then update user
        let uploadPath = path.join(__dirname, '..', 'public', 'images')
        Utils.uploadFile(req.files.avatar, uploadPath, (uniqueFilename) => {
          avatarFilename = uniqueFilename
          // update user with all fields including avatar
          updateUser({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            avatar: avatarFilename,
            accessLevel: req.body.accessLevel               
        })
      })
  }else{
    // update user without avatar
    updateUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email, 
      accessLevel: req.body.accessLevel
    })
  }

    // update User
    function updateUser(update){    
      User.findByIdAndUpdate(req.params.id, update)
      .then(user => res.json(user))
      .catch(err => {
        res.status(500).json({
          message: 'Problem updating user',
          error: err
        })
      }) 
    }
  })


// POST - create new user --------------------------------------

router.post('/', (req, res) => {
    // validate request
    if(Object.keys(req.body).length === 0){   
      return res.status(400).send({message: "User content can not be empty"})
    }
  
    // check account with email doen't already exist
    User.findOne({email: req.body.email})
    .then(user => {
      if( user != null ){
        return res.status(400).json({
          message: "an account with this email address already exists"
        })
      }
    // create new user       
    let newUser = new User(req.body)
    
    // save to database
    newUser.save()
      .then(user => {        
        // success!  
        // return 201 status with user object
        return res.status(201).json(user)
      })
      .catch(err => {
        console.log(err)
        return res.status(500).send({
          message: "Problem creating account",
          error: err
        })
      })
    })
  })

// export
module.exports = router