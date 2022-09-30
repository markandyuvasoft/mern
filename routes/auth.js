import express from 'express'
import mongoose from 'mongoose'
import User from '../models/user.js';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import auth from '../middleware/auth.js';

const authrouter = express.Router()

//register route
authrouter.post("/register", async (req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).send({ error: "plz fill the field properly" })
    }

    try {

        const userexist = await User.findOne({ email: email })

        if (userexist) {

            return res.status(422).send({ error: "Email already exist" })

        } else if (password != cpassword) {

            return res.status(422).send({ error: "password are not match" })

        } else {
            const user = new User({ name, email, phone, work, password, cpassword })

            await user.save()

            res.status(200).send({ message: "user register successfully" })
        }
    } catch (err) {
        console.log(err)
    }
})


//login route

authrouter.post("/login", async (req, res) => {

    try {
        let token

        const { email, password } = req.body

        if (!email || !password) {

            return res.status(400).send({ error: "Plz fill the proper data" })

        }
        const userlogin = await User.findOne({ email: email })

        if (userlogin) {

            const ismatch = await bcrypt.compare(password, userlogin.password)

            token = await userlogin.generateauthtoken()

            res.cookie("jwtoken", token, {     // cookie generate krweee

                expires: new Date(Date.now() + 2589200000),

                httpOnly: true

            })

            if (!ismatch) {

                res.status(400).send({ message: "user login error" })

            } else {
                res.status(200).send({ message: "user login successfully", token })
            }
        } else {

            res.status(400).send({ message: "user login error" })
        }

    } catch (error) {

        console.log(error);
    }
})



authrouter.get("/contact",(req,res)=>{

    res.cookie("test","aman")

    res.send(req.rootuser)   //user ka full data hai rootuser mee
})


authrouter.post("/contact", async (req, res) => {

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


authrouter.get("/logout", (req, res) => {

    res.clearCookie('jwtoken', { path: '/' })

    res.status(200).send("user logout")
})

export default authrouter;
