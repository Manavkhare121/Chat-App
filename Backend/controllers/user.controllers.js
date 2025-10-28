import { validationResult } from "express-validator";
import { createuser } from '../services/user.service.js';
import { UserModel } from "../models/user.model.js";

export const createUsercontroller = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await createuser(req.body); 
    const token = await user.generateJWT();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
};


export const loginController=async(req,res)=>{
   const errors = validationResult(req);
 
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {email,password}= req.body; 
    const user=await UserModel.findOne({email}).select('+password');
    if(!user){
        return res.status(401).json({
            errors:"invalid credentials"
        })
    }
    
    const isMatch=await user.isValidPassword(password);
    
    if(!isMatch){
        return res.status(401).json({errors:"Invalid credentials"})
    }
        const token = await user.generateJWT();

         res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
    });
    
    res.status(201).send({ user, token });

} catch (error) {
    res.status(400).send(error.message);
  }
}

export const profileController=async (req,res)=>{
    console.log(req.user);
    res.status(200).json({
        user:req.user
    })
}