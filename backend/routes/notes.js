const express = require('express')
const router = express.Router()
const Note = require('../models/Note')
const fetchUser = require('../middleware/fetchUser')
const { body, validationResult } = require('express-validator')

// ROUTE 1 : Fetch all user Notes using GET :  "/api/notes/fetchallnotes" - login required
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        //Get all the notes of the user
        const notes = await Note.find({ user: req.user.id })
        res.send(notes)
    } catch (err) {
        console.log(err.message)
        return res.status(500).send("Internal Server Error")
    }

})

// ROUTE 2 :Add a new note using POST :  "/api/notes/addnote" - login required
router.post('/addnote', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {


    // Validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    let { title, description, tag } = req.body

    //Set a default tag
    if (tag === "") tag = "General"

    try {
        //Create a new Note
        const note = new Note({
            title,
            tag,
            description,
            user: req.user.id
        })

        const savedNote = await note.save()
        res.send(savedNote)

    } catch (err) {
        console.log(err.message)
        return res.status(500).send("Internal Server Error")
    }

})

// ROUTE 3 : Update an existing note using PUT :  "/api/notes/updatenote/:id" - login required
router.put('/updatenote/:id', fetchUser, async (req, res) => {

    const { title, description, tag } = req.body

    try {
        const note = await Note.findById(req.params.id)

        //Check if note exist or not
        if (!note) {
            return res.status(404).send("Not Found")
        }

        //Allow updation only if user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        const newNote = {}

        if (title) newNote.title = title
        if (description) newNote.description = description
        if (tag) newNote.tag = tag

        await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.send(newNote)

    } catch (err) {
        console.log(err.message)
        return res.status(500).send("Internal Server Error")
    }

})

// ROUTE 4 : Delete a note using DELETE :  "/api/notes/deletenote/:id" - login required
router.delete('/deletenote/:id', fetchUser, async (req, res) => {

    const { title, description, tag } = req.body

    try {
        const note = await Note.findById(req.params.id)

        //Check if note exist or not
        if (!note) {
            return res.status(404).send("Not Found")
        }

        //Allow updation only if user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        await Note.findByIdAndDelete(req.params.id)
        res.send("Note Deleted Successfully")

    } catch (err) {
        console.log(err.message)
        return res.status(500).send("Internal Server Error")
    }

})

module.exports = router