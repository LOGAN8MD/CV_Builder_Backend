import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
  try {
    const { username, email, contact, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ msg: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      contact,
      password: hashed
    });

    res.json({ msg: "Registered successfully", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log("########### Login new")
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    if (!user){
      console.log("User not found")
      return res.status(400).json({ msg: "User not found" });
    } 

    const match = await bcrypt.compare(password, user.password);
    if (!match){
      console.log("Invalid credentials")
      return res.status(400).json({ msg: "Invalid credentials" });
    } 
    console.log(user)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d"
    });
    console.log("@@@@@@@@@@@@@")
    console.log(token)
    console.log("&&&&&&&&&&&&&")
     console.log(user)
    res.json({ token, user });
  } catch (err) {
    console.log("Error",err.message)
    res.status(500).json({ msg: err.message });
  }
};

// Google Login

export const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;

      const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID, // Ensure token is for your app
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;


    let user = await User.findOne({ email });

    if (user) {
      // User exists, link googleId if not set
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        username: name,
        email,
        googleId,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Google login failed" });
  }
};

