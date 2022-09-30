import express from 'express'
import mongoose from 'mongoose'
import User from '../models/user.js';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import auth from '../middleware/auth.js';
import  token  from 'morgan';

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


authrouter.get("/logout", (req, res) => {

    res.clearCookie('jwtoken', { path: '/' })

    res.status(200).send("user logout")
})

export default authrouter;
