const express=require("express")
const router=express.Router()
const {User}=require('../models/model')

// Registration and login
// const path=require("path")
// const fs =require('fs')
const jwt= require("jsonwebtoken")
const JWT_SECRET=process.env.JWT_SECRET

// password hashing using bcrypt
const bcrypt= require ('bcryptjs')


// register
router.post("/register",async (req,res)=>{
    try {
        const{name,email,password}=req.body
        const existUser=await User.findOne({email})
        if (existUser){
            return res.status(400).json({message:"Email already exists"})
        }
        // hashing
        const salt = await bcrypt.genSalt(12)
        const hashedPassword=await bcrypt.hash(password,salt)
        const user = new User({name,email,password:hashedPassword})
        const savedUser=await user.save()
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

// login

router.post("/login",async (req,res)=>{
    try {
        const {email,password}=req.body
        const user=await User.findOne({email})
        if (!user){
            return res.status(400).json({message:"User not found"})
        }
        // password matching
        const isMatch=await bcrypt.compare(password,user.password)
        if (!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
        // generate token
        const token=jwt.sign({id:user._id},JWT_SECRET,{expiresIn:'1h'})
        res.status(200).json({message:"Login successful",user,token}) 
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})




module.exports=router