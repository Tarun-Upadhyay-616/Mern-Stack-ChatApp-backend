import {Router} from "express"
import { SearchContacts , getRecentChats } from "../controllers/ContactsController.js"
import { verifytoken } from './../middlewares/verifytoken.js';

const contactsroutes = Router()

contactsroutes.post("/search",verifytoken,SearchContacts)
contactsroutes.get("/get-contacts-for-dm",verifytoken,getRecentChats)


export default contactsroutes