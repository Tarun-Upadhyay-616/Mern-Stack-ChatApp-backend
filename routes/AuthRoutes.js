import express from "express";
import { getUserInfo, login, logout, passwordReset, profilesetup, resetotp, sendotp, signup, verifymail } from "../controllers/AuthControllers.js";
import { userAuth } from './../middlewares/userAuth.js';

const authroutes = express.Router()

authroutes.post("/signup",signup)
authroutes.post("/login",login)
authroutes.post("/logout",logout)
authroutes.post("/sendotp",userAuth,sendotp)
authroutes.post("/resetotp",resetotp)
authroutes.post("/passwordreset",passwordReset)
authroutes.post("/verifymail",userAuth,verifymail)
authroutes.post("/profilesetup",userAuth,profilesetup)
authroutes.get("/user-info",userAuth,getUserInfo)

export default authroutes