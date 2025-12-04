import express from "express";
import {
  createCV,
  getCVs,
  updateCV,
  deleteCV,
  getCVById
  
} from "../controllers/cvController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createCV);
router.get("/", auth, getCVs);
router.put("/:id", auth, updateCV);
router.delete("/:id", auth, deleteCV);
router.get("/:id", auth, getCVById);

export default router;
