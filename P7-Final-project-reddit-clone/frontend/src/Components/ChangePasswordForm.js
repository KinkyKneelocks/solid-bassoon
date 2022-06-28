import React, { useContext, useState } from "react";
import { UserContext } from "../Services/UserContext"
import { useNavigate } from "react-router-dom"
import logout from "../Services/LogoutFunction";
import validateInput from "../Services/valideInput"

const ChangePasswordForm = () => {
    let navigate = useNavigate()
    const { user, setUser } = useContext(UserContext)
    const [isPending, setIsPending] = useState(false)
    const [passwordError, setPasswordError] = useState()
    const [passwordMatch, setPasswordMatch] = useState(true)
    const [oldPasswordError, setOldPasswordError] = useState(false)
    const [processError, setProcessError] = useState()
    const [formData, setFormData] = useState({
        username: user,
        oldpw: '',
        password: '',
        confirmpassword: ''
    })

    const passwordValidationRules = [
        {regexp: ".{8,}", errormsg: "Password must be at least 8 characters long!", valid: false},
        {regexp: ".*[A-Z]", errormsg: "Password must have at least one uppercase character", valid: false},
        {regexp: ".*[a-z]", errormsg: "Password must have at least one lowercase character", valid: false},
        {regexp: ".*[0-9]", errormsg: "Password must have at least one number", valid: false}
    ]

    const logMeOut = () => {
        logout()
        setUser(null)
        navigate('/')
    }

    const handleChange = (event) => {
        if (processError) {
            setProcessError()
        }
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setOldPasswordError(false)
        let passwordErrorMsgs = validateInput(passwordValidationRules, formData.password)

        if (passwordErrorMsgs.length !== 0) {
            setPasswordError(passwordErrorMsgs)                      
        } else {
            setPasswordError()
        }

        if (formData.password !== formData.confirmpassword) {
            setPasswordMatch(false)                                   
        } else {
            setPasswordMatch(true)
        }

        if (formData.password !== formData.confirmpassword || passwordErrorMsgs.length !== 0 ){  
            console.log('form cannot be sent')          
            return
        }

        setIsPending(true)

        fetch('http://localhost:3000/api/users/changepassword', {
            method: 'PUT',
            credentials: 'include',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                username: formData.username,
                password: formData.password,
                oldpw: formData.oldpw
            })
        })
        .then((res) => {
            if (res.status === 401) {
                setOldPasswordError(true)
                setIsPending(false)
                throw Error('Old password is incorrect')
            }
            if (res.status !== 200) {
                setIsPending(false)
                setProcessError('Service is currently not available')
                return res.text().then(text => { throw new Error(text) })
            } else {
                return res.json()
            }
        })
        .then((data) => {
            console.log(data)
            logMeOut()            
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
        <div className="changepw-prompt">
            <form className="password-form form" onSubmit={handleSubmit}>
                <input 
                    type="password"
                    name="oldpw"
                    onChange={handleChange}
                    value={formData.oldpw}
                    placeholder="Old password"
                />
                { oldPasswordError && <ul><li>Old password is incorrect!</li></ul> }

                <input 
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    placeholder="New password"
                />
                {passwordError && <ul>{passwordError.map(error => <li>{error}</li>)}</ul>}
                <input 
                    type="password"
                    name="confirmpassword"
                    onChange={handleChange}
                    value={formData.confirmpassword}
                    placeholder="Confirm new password"
                />
                { !passwordMatch && <ul><li>Passwords must match!</li></ul>}
                {isPending ? 
                    <button className="form__button form__button--disabled" type="submit" disabled>Change my password</button> :
                    <button className="form__button" type="submit">Change my password</button>
                }
            </form>
        </div>
    )
}

export default ChangePasswordForm