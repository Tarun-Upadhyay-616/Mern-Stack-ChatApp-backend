import {Router} from "express"
import { SearchContacts } from "../controllers/ContactsController.js"
import { verifytoken } from './../middlewares/verifytoken.js';

const contactsroutes = Router()

contactsroutes.post("/search",verifytoken,SearchContacts)


export default contactsroutes