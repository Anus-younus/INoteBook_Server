import express from "express";
import Joi from "joi";
import sendResponce from "../helpers/sendResponce.js";
import Note from "../models/Note.js";

const router = express.Router();

const notesSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    tag: Joi.string().optional(),
});

router.post("/addNote", async (req, res) => {
    try {
        const { error, value } = notesSchema.validate(req.body);
        if (error) return sendResponce(res, 400, null, true, error.message);

        const { title, description, tag } = value;

        const note = new Note({
            title,
            description,
            tag: tag || "general",
            user: req.user.id,
        });
        const savedNote = await note.save();

        sendResponce(res, 201, savedNote, false, "Note created successfully");
    } catch (e) {
        console.error("Internal server error", e);
        sendResponce(res, 500, null, true, "Internal server error");
    }
});


router.put("/updateNote/:id", async (req, res) => {
    try {
        const { error, value } = notesSchema.validate(req.body);
        if (error) return sendResponce(res, 400, null, true, error.message);

        const { title, description, tag } = value;

        let note = await Note.findById(req.params.id)
        if(!note) return sendResponce(res, 201, null, true, "Note note found")

        
        const newNote = {
            title,
            description,
            tag: tag || "general",
            user: req.user.id,
        };

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        sendResponce(res, 404, note, false, "Note updated succesfully")
    } catch (e) {
        console.error("Internal server error", e);
        sendResponce(res, 500, null, true, "Internal server error");
    }
});

router.get("/fetchNotes", async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        sendResponce(res, 200, notes, false, "Fetched successfully");
    } catch (e) {
        console.error("Internal server error", e);
        sendResponce(res, 500, null, true, "Internal server error");
    }
});

router.delete("/deleteNote/:id", async (req, res) => {
    try {
        let note = await Note.findById(req.params.id)
        if(!note) return sendResponce(res, 201, null, true, "Note note found")

        // if(note.user.toString() !== req.user.id) return sendResponce(res, 202, null, true, "Not Allowed")
        
        note = await Note.findByIdAndDelete(req.params.id)
        sendResponce(res, 404, note, false, "Note deleted succesfully")
    } catch (e) {
        console.error("Internal server error", e);
        sendResponce(res, 500, null, true, "Internal server error");
    }
})

export default router;
