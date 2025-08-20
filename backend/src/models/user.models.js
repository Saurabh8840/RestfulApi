import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    
    Name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    age:{
        type:String,
        requied:true,
    },
    
},{timestamps:true})

export const User=mongoose.model("User",userSchema)



