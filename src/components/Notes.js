import React, { useContext, useEffect, useRef, useState } from 'react'
import NoteItem from './NoteItem'
import NoteContext from '../context/notes/NoteContext'
import AddNote from './AddNote'
import { useNavigate } from "react-router-dom"

const Notes = (props) => {
    const context = useContext(NoteContext)
    const { notes, editNote, getNotes } = context

    const navigate = useNavigate()

    const ref = useRef(null)

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes()
        }
        else {
            navigate('/login')
        }

    }, [])

    const [note, setNote] = useState({ _id: "", etitle: "", edescription: "", etag: "" })

    const updateNote = currNote => {
        setNote({ _id: currNote._id, etitle: currNote.title, edescription: currNote.description, etag: currNote.tag })
        ref.current.click()
    }



    const onChangeHandler = event => {
        setNote(prevNote => ({ ...prevNote, [event.target.name]: event.target.value }))
    }

    const handleClick = (event) => {
        // event.preventDefault()
        editNote(note._id, note.etitle, note.edescription, note.etag)
        ref.current.click()
        props.showAlert("success", "Note Updated Successfully")
    }


    return (
        <>
            <AddNote showAlert={props.showAlert} />
            <button type="button" className="btn btn-primary d-none" ref={ref} data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="tex" className="form-control" id="etitle" name="etitle" value={note.etitle} onChange={onChangeHandler} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChangeHandler} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChangeHandler} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleClick}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row my-3">
                <h1>Your Notes</h1>
                {notes.length === 0 && <div className='text-center'>No notes to display</div>}
                {notes.map((note) => {
                    return <NoteItem key={note._id} note={note} updateNote={updateNote} showAlert={props.showAlert} />
                })}
            </div>
        </>
    )
}

export default Notes