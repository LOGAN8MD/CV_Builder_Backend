import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String },
    password: { type: String },
    googleId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
