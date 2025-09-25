import express from "express";
import { getUserInfo, login, logout, passwordReset, profilesetup, resetotp, sendotp, signup, verifymail, addProfileImage, removeProfileImage } from "../controllers/AuthControllers.js";
import { userAuth } from './../middlewares/userAuth.js';
import multer from "multer";
import { verifytoken } from './../middlewares/verifytoken.js';

const authroutes = express.Router()
const upload = multer({dest: "uploads/profiles/"})
authroutes.post("/signup",signup)
authroutes.post("/login",login)
authroutes.post("/logout",logout)
authroutes.post("/sendotp",userAuth,sendotp)
authroutes.post("/resetotp",resetotp)
authroutes.post("/passwordreset",passwordReset)
authroutes.post("/verifymail",verifytoken,verifymail)
authroutes.post("/profilesetup",verifytoken,profilesetup)
authroutes.post("/addprofileimg",verifytoken , upload.single("profile-image"), addProfileImage)
authroutes.get("/user-info",verifytoken,getUserInfo)
authroutes.delete('/removeprofileimage',verifytoken,removeProfileImage)

export default authroutes