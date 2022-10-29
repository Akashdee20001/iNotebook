import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"

const Signup = (props) => {

    const { showAlert } = props

    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
    const navigate = useNavigate()

    const onChangeHandler = event => {
        setCredentials(oldCreds => ({ ...oldCreds, [event.target.name]: event.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const response = await fetch("http://localhost:5000/api/auth/createUser", {

            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
        })

        const json = await response.json()

        if (json.success) {
            localStorage.setItem('token', json.authToken)
            navigate('/')
            showAlert("success", "Signed up successfully")
        }
        else {
            showAlert("danger", "Invalid Credentials")
        }
    }

    return (
        <div className='container my-3'>
            <h1>Signup to use iNotebook</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" value={credentials.name} aria-describedby="emailHelp" onChange={onChangeHandler} required minLength={3} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={credentials.email} aria-describedby="emailHelp" onChange={onChangeHandler} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' value={credentials.password} onChange={onChangeHandler} required minLength={5} />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name='cpassword' value={credentials.cpassword} onChange={onChangeHandler} required minLength={5} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup