import express from "express";
import {
  createNote,
  getAllNotes,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";

const router = express.Router();

router.get("/", createNote);
router.post("/", getAllNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;