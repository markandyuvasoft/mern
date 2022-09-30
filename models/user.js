import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import  Jwt  from "jsonwebtoken";

const userSchema = new mongoose.Schema({

    name:{

        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    phone:{
        type:Number,
        required:true
    },

    work:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    cpassword:{
        type:String,
        required:true
    },

    date:{
        type: Date,
        default: Date.now
    },
    messages:[
        {
            name:{

                type:String,
                required:true
            },
        
            email:{
                type:String,
                required:true
            },
        
            phone:{
                type:Number,
                required:true
            },
        
            message:{
                type:String,
                required:true
            },
        
        }
    ],
    tokens:[{

        token:{
            type:String,
            required:true
        }
    }]
})

// hash the password function
userSchema.pre('save', async function (next) {

    if (this.isModified('password')) {

        this.password = await bcrypt.hash(this.password, 12)

        this.cpassword = await bcrypt.hash(this.cpassword, 12)
    }
    next()
})


//generate the token
userSchema.methods.generateauthtoken = async function (){

    try {

        let token = Jwt.sign({_id: this._id}, process.env.SECRET_KEY)

        this.tokens = this.tokens.concat({ token:token })

        await this.save()

        return token

    } catch (error) {
        
        res.send("error")
    }
}


userSchema.methods.addMessage = async function (name, email, phone, message) {

    try {
        
        this.messages = this.messages.concat({ name, email, phone, message })

        console.log(`addmessage  ${this.messages}`);
      await this.save()

      return this.messages

    } catch (error) {
        
        res.send("error")
    }
}


const User= mongoose.model('user',userSchema)

export default User
