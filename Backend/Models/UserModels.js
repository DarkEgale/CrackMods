

import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is Required"],
    },
    email:{
        type:String,
        unique:true,
        required:[true,"email is Required"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:"user"
    }
},{timestamps:true})


UserSchema.index({email:'email'})

const User=mongoose.model('User',UserSchema)
export default User;