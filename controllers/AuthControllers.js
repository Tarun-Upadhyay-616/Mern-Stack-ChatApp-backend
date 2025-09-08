import { compare } from "bcrypt"
import bcrypt from "bcrypt"
import { User } from "../models/UserModel.js"
import jwt from "jsonwebtoken"
import { transport } from "../nodemailer.js"
export const signup = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body
        if (!email || !password) {
            return res.status(400).send("Email and Password is required")
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ email, password: hashedPassword })
        await user.save()
        const token = jwt.sign({ email, id: user.id }, process.env.JWT_KEY, { expiresIn: '7d' })
        res.cookie('jwt', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production", // true in production only
            // sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        const mailOptions = {
            from: process.env.SENDER_MAIL,
            to: email,
            subject: "Welcome to Our Chat App",
            text: `Hi ${email}\n Thanks for joining our chat app. You're all set to start chatting in real time.\n\n Happy Chatting!\n -Tarun Upadhyay`
        }
        await transport.sendMail(mailOptions);
        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profilesetup: user.profilesetup
            }
        })
    } catch (error) {
        return res.status(500).send(error.message)
    }

}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).send("Email and Password is required")
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({
                success: false,
                message: "User not registered"
            })
        }
        const auth = await compare(password, user.password)
        if (!auth) {
            return res.json({
                success: false,
                message: "Password mismatched"
            })
        }
        const token = jwt.sign({ email, id: user.id }, process.env.JWT_kEY, { expiresIn: '7d' })
        res.cookie('jwt', token, {
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                image: user.image,
                color: user.color,
                profilesetup: user.profilesetup
            }
        })
    } catch (error) {
        return res.status(500).send(error.message)
    }
}
export const getUserInfo = async (req, res, next) => {
    try {
        const userData = await User.findById(req.userId)
        if (!userData) {
            return res.status(404).send("User Not Found")
        }
        return res.status(200).json({
            id: userData.id,
            email: userData.email,
            profilesetup: userData.profilesetup,
            firstname: userData.firstname,
            lastname: userData.lastname,
            image: userData.image,
            color: userData.color,
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send("Internal Server Error")
    }
}
export const sendotp = async (req, res) => {
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    const userid = req.body.userId
    if (User.isAuthenticated) {
        res.json({
            success: false,
            message: "user already verified"
        })
    }

    const user = await User.findById(userid)
    user.verifyotp = otp
    await user.save()
    const mailOptions = {
        from: process.env.SENDER_MAIL,
        to: user.email,
        subject: "Verification of Email",
        text: `Your one time otp is ${otp}.Kindly Use this to verify your account`
    }
    await transport.sendMail(mailOptions);
    res.json({
        success: true,
        message: "otp sent succesfully to mail id"
    })
}
export const resetotp = async (req, res) => {
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    const email = req.body
    const user = await User.findOne(email)
    if (!user) {
        res.json({
            success: false,
            message: "Invalid Email"
        })
    }
    user.verifyotp = otp
    await user.save()
    const mailOptions = {
        from: process.env.SENDER_MAIL,
        to: user.email,
        subject: "Password Reset Email",
        text: `Your one time otp is ${otp}.Kindly Use this to reset your account password`
    }
    await transport.sendMail(mailOptions);
    res.json({
        success: true,
        message: "otp sent succesfully to mail id"
    })
}
export const passwordReset = async (req, res) => {
    const userotp = req.body
    const email = req.body
    const newpass = req.body
    const user = await User.findById(email)
    if (user.verifyotp == userotp) {
        user.verifyotp = ""
        user.password = newpass
        res.json({
            success: true,
            message: "password chnaged Succesfully"
        })
    } else {
        res.json({
            success: false,
            message: "Invalid otp"
        })
    }

}
export const verifymail = async (req, res) => {
    const userid = req.body.userId
    const { userotp } = req.body
    const user = await User.findById(userid)
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" })
    }

    if (user.verifyotp == userotp) {
        user.isAuthenticated = true
        user.verifyotp = " "
        await user.save()
        res.json({
            success: true,
            message: "You are now verified"
        })

    } else {
        res.json({
            success: false,
            message: "Invalid otp"
        })
    }
}
export const logout = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            // secure: true,
            sameSite: "None",
        })

        return res.status(200).json({
            message: "You logout successfully"
        })
    } catch (error) {
        res.send(error.message)
    }
}
export const profilesetup = async (req, res) => {
    try {
        const userid = req.body.userId
        const { firstname, lastname, color } = req.body
        if (!firstname || !lastname || !color) {
            return res.status(400).send("Firstname, Lastname, Color are required")
        }
        const user = await User.findByIdAndUpdate(userid, {
            firstname, lastname, color,
            profilesetup: true
        }, { new: true , runValidators:true })
        return res.status(200).json({
            id: user.id,
            email: user.email,
            profilesetup: user.profilesetup,
            firstname: user.firstname,
            lastname: user.lastname,
            image: user.image,
            color: user.color,
        })
    } catch (error) {
        console.log(error)
    }
}