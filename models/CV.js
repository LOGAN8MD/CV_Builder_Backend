import mongoose from "mongoose";

const cvSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    layout: { type: String, default: "layout1" },

    basic: {
      name: String,
      email: String,
      contact: String,
      intro: String,
    },

    education: Array,
    experience: Array,
    projects: Array,
    skills: Array,
    social: Array,

    design: {
      fontFamily: { type: String },
      fontSize: { type: Number },
      primaryColor: { type: String },
      accentColor: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("CV", cvSchema);
