import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import jsonwebtoken from "jsonwebtoken"
import cookieparser from "cookie-parser"
import authroutes from "./routes/AuthRoutes.js"
dotenv.config()

const port  = process.env.PORT || 3005
const dburl = process.env.DATABASE_URL
const app = express()
app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET","POST","PUT","PATCH","DELETE"],
    credentials: true
}))
app.use(express.json)
// app.use(cookieparser())
// app.use(authroutes)
app.get("/auth",(req,res)=>{
    try {
        res.send("WORKING") 
    } catch (error) {
        console.log(error.message)
    }
})
mongoose.connect(dburl)
    .then(console.log("mongodb connected"))
    .catch((err)=>{
        console.log(err.message);
    })
app.listen(port,()=>{
    console.log(`App listening on http://localhost:${port}`)
})