import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema=new mongoose.Schema(
{
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        minLength:[6,'Emial must be at least 6 characters long'],
        maxLength:[50,'Email must not be longer than 50 characters']
    },
    password:{
        type:String,
        select:false // ensure the password is not going on the frontend 

    }
},{
    timestamps:true
})

userSchema.statics.hashPassword=async function (password){
    return await bcrypt.hash(password,10)
}

userSchema.methods.isValidPassword=async function name(password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateJWT=function(){
    return jwt.sign({email:this.email},process.env.JWT_SECRET,{expiresIn:'7d'}   )
}

export const UserModel = mongoose.model("User", userSchema);