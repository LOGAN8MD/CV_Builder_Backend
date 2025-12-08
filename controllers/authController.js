import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
