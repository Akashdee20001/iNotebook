import React, { useState, useContext } from 'react'
import { useNavigate } from "react-router-dom"

const Login = (props) => {

    const { showAlert } = props

    const [credentials, setCredentials] = useState({ email: "", password: "" })

    const navigate = useNavigate()

    const onChangeHandler = event => {
        setCredentials(oldCreds => ({ ...oldCreds, [event.target.name]: event.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const response = await fetch("http://localhost:5000/api/auth/login", {

            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        })

        const json = await response.json()

        if (json.success) {
            localStorage.setItem('token', json.authToken)
            showAlert("success", "Logged in successfully")
            navigate('/')
        }
        else {
            showAlert("danger", "Invalid Username or Password")
        }
    }

    return (
        <div className='container my-3'>
            <h1>Login to continue to iNotebook</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={credentials.email} aria-describedby="emailHelp" onChange={onChangeHandler} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' value={credentials.password} onChange={onChangeHandler} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login