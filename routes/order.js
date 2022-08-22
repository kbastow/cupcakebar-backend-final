const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const Order = require('./../models/Order')

// GET- get orders ---------------------------
router.get('/', Utils.authenticateToken, (req, res) => {
  Order.find().populate('user').populate('products')
    .then(orders => {
      if(orders == null){
        return res.status(404).json({
          message: "No orders found"
        })
      }
      res.json(orders)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem getting orders"
      })
    })  
})

// POST - create new order --------------------------------------
router.post('/', Utils.authenticateToken, (req, res) => {
  // validate
  console.log(req.body)
  if(Object.keys(req.body).length === 0){   
    return res.status(400).send({message: "Order can't be empty"})
  }
  // validate - check if all fields are complete
  if(!req.body){
    return res.status(400).send({message: "Please complete order"})
  }

  console.log('req.body = ', req.body)

  // create new order
  let newOrder = new Order({
    user: req.body.id,
    products: req.body.products,
    total: req.body.total,
    status: req.body.status
  })
  
  newOrder.save()
    .then(orders => {        
      // success!  
      // return 201 status with tracker object
      return res.status(201).json(orders)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({
        message: "Problem completing order",
        error: err
      })
    })
})

// DELETE - Remove items from orders view ---------------------------------------------

router.delete('/deleteOrder/', Utils.authenticateToken,(req, res) => {
  // validate the request
  if(!req.body.orderId){
    return res.status(400).json({
      message: "no order specified"
    })
  }
  // remove order from orders view using Order model
  Order.findOneAndUpdate({
    _id: req.order._id
  }, {
    $pull: {
      order: req.body.orderId
    }
  })
  .then(() => {
    res.json({ message: "success" })
  })
  .catch((err) => {
    console.log("error removing order", err)
    res.status(500).json({
      message: "error removing order",
      error: err
    })
  })
})

// export
module.exports = router