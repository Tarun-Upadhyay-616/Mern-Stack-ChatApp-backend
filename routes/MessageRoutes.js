import {Router} from "express"
import { verifytoken } from './../middlewares/verifytoken.js';
import { getAllMessages, getRecentChats } from "../controllers/MessageController.js";

const messageroutes = Router()

messageroutes.post("/getMessages",verifytoken,getAllMessages)
messageroutes.get("/recent-chats", verifytoken, getRecentChats)


export default messageroutes