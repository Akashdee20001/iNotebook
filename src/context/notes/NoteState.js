import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props) => {

    const notesInitial = []
    const baseUrl = "http://localhost:5000/api/notes"

    const [notes, setNotes] = useState(notesInitial)

    const getNotes = async () => {

        const response = await fetch(`${baseUrl}/fetchallnotes`, {

            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        })
        const data = await response.json()
        setNotes(data)
    }

    const addNote = async (title, description, tag) => {
        const response = await fetch(`${baseUrl}/addnote`, {

            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        })

        const note = await response.json()
        setNotes(prevNotes => prevNotes.concat(note))
    }

    const deleteNote = async (id) => {

        await fetch(`${baseUrl}/deletenote/${id}`, {

            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        })

        setNotes(prevNotes => prevNotes.filter(note => note._id !== id))
    }

    const editNote = async (id, title, description, tag) => {
        const response = await fetch(`${baseUrl}/updatenote/${id}`, {

            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        })

        const data = await response.json()
        data._id = id

        setNotes(prevNotes => {
            const filteredNotes = prevNotes.filter(note => note._id !== id)
            const newNotes = filteredNotes.concat(data)
            return newNotes
        })
    }

    return (
        <NoteContext.Provider value={{ notes, setNotes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    )

}

export default NoteState