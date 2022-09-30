import express from 'express'
import mongoose from 'mongoose'
import User from '../models/user.js';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import auth from '../middleware/auth.js';
import  token  from 'morgan';

const userrouter = express.Router()


userrouter.get("/contact",(req,res)=>{

    res.cookie("test",token)

    res.send(req.rootuser)   //user ka full data hai rootuser mee
})


userrouter.post("/contact", async (req, res) => {

    try {

        const { name, email, phone, message } = req.body

        if (!name || !email || !phone || !message) {

            return res.status(400).send({ error: "plzz fill the contact form...." })
        }

         const usercontact = await User.findOne({ email: email })   //email se match krwana hoo isly

        // const usercontact = await User.findOne({ _id: req.userID });    id se match krwana hoo isly
        
        // console.log(usercontact);

        if (usercontact) {

            const usermessage = await usercontact.addMessage(name, email, phone, message)

            await usercontact.save()

            res.status(200).send({ message: "user contact succesfully" })
        }
        else{
            res.status(500).send({ message: "user contact not succesfully" })
        }

    } catch (error) {

        res.send("error")
    }
})




export default userrouter;
