const express=require("express")
const app= express()
const mongoose = require("mongoose")

// dotenv file to store configuration info
require('dotenv').config()
// middleware
app.use(express.json())

// routes
const auth= require('./routes/auth')
app.use('/api/auth',auth)

const user=require('./routes/user')
app.use('/api/user',user)

const emp=require('./routes/emp')
app.use('/api/emp',emp)

const task=require('./routes/task')
app.use('/api/task',task)

console.log(process.env.MONGO_URI)
// Connecting to mongo DB
mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("Mongo DB connected"))
    .catch(err=>console.log("MongoDB Connection error",err))
// Server listener
app.listen(3000,()=>{
    console.log("Server running on port 3000")
})