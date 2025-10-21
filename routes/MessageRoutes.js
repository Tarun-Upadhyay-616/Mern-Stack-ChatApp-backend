import {Router} from "express"
import { verifytoken } from './../middlewares/verifytoken.js';
import { getAllMessages, getRecentChats, uploadFile } from "../controllers/MessageController.js";
import multer  from 'multer';

const messageroutes = Router()
const upload = multer({dest :"uploads/files"})
messageroutes.post("/getMessages",verifytoken,getAllMessages)
messageroutes.post("/upload-file",verifytoken,upload.single("file"),uploadFile)
messageroutes.get("/recent-chats", verifytoken, getRecentChats)


export default messageroutes