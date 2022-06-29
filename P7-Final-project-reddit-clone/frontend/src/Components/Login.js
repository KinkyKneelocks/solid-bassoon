import React from "react"
import LoginForm from "./LoginForm"

const Login = () => {
    return (
        <div className="loginprompt">
        <h1 className="loginprompt__h1">Welcome to Groupomania! Log in to check out the goods! :) </h1>
        <LoginForm />
        </div>
    )
}

export default Login