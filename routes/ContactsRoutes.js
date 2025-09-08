import {Router} from "express"
import { SearchContacts } from "../controllers/ContactsController.js"
import { userAuth } from "../middlewares/userAuth.js"

const contactsroutes = Router()

contactsroutes.post("/search",userAuth,SearchContacts)


export default contactsroutes