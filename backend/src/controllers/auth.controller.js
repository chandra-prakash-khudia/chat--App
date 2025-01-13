import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import  cloudinary  from '../lib/cloudinary.js';
// step3` create a controller
export const Signup = async (req, res) => {
    const {fullName, email , password } = req.body;
    // console.log(req.body);
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if(password.length<6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:'User with this emaol is already registered'});
        }
        const salt =  await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });
        if(newUser){
           await newUser.save();
           const token = generateToken(newUser._id, res);  
           res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                token,
           });
        }else{
            res.status(400).json({message:'Invalid user data'});
        }

    } catch (error) {
        console.log('Error in Signup Controller', error);
        res.status(500).json({ message: 'Server Error' });

    }
};

export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:'Invalid credentials'});
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:'Invalid credentials'});
        }
        const token =  generateToken(user._id , res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
            token,
        });
    }
    catch (error) {
        console.log('Error in Login Controller', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const Logout = async (req, res) => {
    try{
        res.cookie("jwt" ,"",{maxAge: 0});
        res.status(200).json({message:'Logged out successfully'});
    }
    catch(error){
        console.log('Error in Logout Controller', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
    
        if (!profilePic) {
          return res.status(400).json({ message: "Profile pic is required" });
        }
    
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { profilePic: uploadResponse.secure_url },
          { new: true }
        );
    
        res.status(200).json(updatedUser);
      } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
      }
};
// this controller is used to check if the user is authenticated or not
export const checkAuth =  (req, res) => {
    console.log(req.user);
    try {
        console.log(req.user);
        res.status(200).json(req.user);
    }
    catch (error) {
        console.log('Error in checkAuth Controller', error);
        res.status(500).json({ message: 'Server Error' });
    }
};