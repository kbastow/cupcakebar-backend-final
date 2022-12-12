// dependencies ---------------------------------------------
require("dotenv").config()
const bodyParser = require("body-parser")
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const fileUpload = require ("express-fileupload")
const port = process.env.PORT || 5500

// database connection ---------------------------------------------
mongoose.connect(process.env.MONGO_URI, {
    useNewUrLParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("database connected")
    })
    .catch((err) => {
        console.log("database connection failed", err)
    })

// express app ---------------------------------------------
const app = express()
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('*', cors())
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
  }))

// routes ---------------------------------------------

// homepage
app.get('/', (req,res) => {
    res.send("Cupcake Bar")
  })

//auth ---------------------------------------------
const authRouter = require("./routes/auth")
app.use('/auth', authRouter)

//users ---------------------------------------------
const userRouter = require("./routes/user")
app.use('/user', userRouter)

//products ---------------------------------------------
const productRouter = require("./routes/product")
app.use('/product', productRouter)

//orders ---------------------------------------------
const orderRouter = require("./routes/order")
app.use('/order', orderRouter)



// run app ---------------------------------------------
app.listen(port, () => {
    console.log("App is running on port ", port)
})