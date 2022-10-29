import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function About() {


    return (
        <div className="text-center">

            <div className="h-100 p-3 mx-auto flex-column" style={{ maxWidth: "42em" }}>
                <main role="main" style={{ padding: "0 1.5rem" }}>
                    <h1 className="cover-heading">About Us</h1>
                    <p className="lead">Tired of writing down your notes in a notebook? Worry not, iNotebook lets you manage your notes on the cloud. Add as many notes as you want. You can edit as well as delete your notes. So what are you waiting for? Let's get started.</p>
                    <p className="lead">
                        <Link to="/" className="btn btn-lg btn-secondary" style={{
                            padding: ".75rem 1.25rem",
                            fontWeight: "700"
                        }}>Manage Your Notes</Link>
                    </p>
                </main>
            </div>
        </div>
    )
}
