import { Schema, model } from "mongoose";
import bcrypt  from "bcrypt"
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    firstname:{
        type: String,
        required: false
    },
    lastname:{
        type: String,
        required: false
    },
    image:{
        type: String,
        required: false
    },
    color:{
        type: Number,
        required: false,
    },
    profilesetup:{
        type:Boolean,
        default: false
    },
    isAuthenticated:{
        type:Boolean,
        default: false
    },
    verifyotp:{
        type:Number
    },
})

export const User = mongoose.model("User",userSchema)