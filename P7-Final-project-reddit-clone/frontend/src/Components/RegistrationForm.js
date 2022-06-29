import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import validateInput from "../Services/valideInput"

const RegistrationForm = () => {
    let navigate = useNavigate()
    const [formData, setFormData] = useState(
        {username: "", password: "", confirmpassword: ""}
    )

    const [passwordError, setPasswordError] = useState()
    const [passwordMatch, setPasswordMatch] = useState(true)
    const [usernameError, setUsernameError] = useState()
    const [processError, setProcessError] = useState()
    const [isPending, setIsPending] = useState(false)

    const passwordValidationRules = [
        {regexp: ".{8,}", errormsg: "Password must be at least 8 characters long!", valid: false},
        {regexp: ".*[A-Z]", errormsg: "Password must have at least one uppercase character", valid: false},
        {regexp: ".*[a-z]", errormsg: "Password must have at least one lowercase character", valid: false},
        {regexp: ".*[0-9]", errormsg: "Password must have at least one number", valid: false}
    ]

    const usernameValidationRules = [
        {regexp: "[^A-Za-z0-9]", errormsg: "Only the following characters are allowed: uppercases, lowercases, digits", valid: true}
    ]

    const handleChange = (event) => {
        if (processError) {
            setProcessError()
        }
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        let passwordErrorMsgs = validateInput(passwordValidationRules, formData.password)

        if (passwordErrorMsgs.length !== 0) {
            setPasswordError(passwordErrorMsgs)            
        } else {
            setPasswordError()
        }

        let usernameErrorMsgs = validateInput(usernameValidationRules, formData.username)

        if (usernameErrorMsgs.length !== 0) {
            setUsernameError(usernameErrorMsgs)            
        } else {
            setUsernameError()
        }

        if (formData.password !== formData.confirmpassword) {
            setPasswordMatch(false)                        
        } else {
            setPasswordMatch(true)
        }

        if (formData.password !== formData.confirmpassword 
            || passwordErrorMsgs.length !== 0 
            || usernameErrorMsgs.length !== 0){  
            console.log('form cannot be sent')          
            return
        }

        setIsPending(true)
        fetch('http://localhost:3000/api/users/signup', {
            method: 'POST',
            credentials: 'include',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(formData)
        }).then((response) => {
            if (response.status === 200) {
                setIsPending(false)                
                navigate('/')
            } else if (response.status === 409) {
                setProcessError('Username is already in use. Please choose a different one!')
                setIsPending(false)
                return response.text().then(text => { throw new Error(text) })
            } else {
                setProcessError('Oops... Something went wrong! Please try again late!')
                setIsPending(false)
                return response.text().then(text => { throw new Error(text) })
            }
        }).catch((error) => {
            console.log(error)            
        })        
    }

    return (
        <form className="registration-form form" onSubmit={handleSubmit}>
            <input 
                type="text" 
                name="username" 
                onChange={handleChange} 
                placeholder="Username"
                value={formData.username}                
            />
            {usernameError && <ul>{usernameError.map(error => <li>{error}</li>)}</ul>}
            <input 
                type="password" 
                name="password" 
                onChange={handleChange} 
                placeholder="Password" 
                value={formData.password}                
            />
            {passwordError && <ul>{passwordError.map(error => <li>{error}</li>)}</ul>}
            <input 
                type="password" 
                name="confirmpassword" 
                onChange={handleChange} 
                placeholder="Confirm password" 
                value={formData.confirmpassword}                
            />
            {!passwordMatch && <ul><li>Passwords must match!</li></ul>}
            {processError && <p className="form__process-error">{processError}</p>}
            {isPending ? <button className="form__button form__button--pending" type="submit" disabled>Let's sign up</button> : <button className="form__button" type="submit">Let's sign up</button>}                       
        </form>
    )
}

export default RegistrationForm