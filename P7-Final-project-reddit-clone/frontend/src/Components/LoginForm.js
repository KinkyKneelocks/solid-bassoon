import React, {useContext, useState} from "react"
import validateInput from "../Services/valideInput"
import { UserContext } from "../Services/UserContext"


const LoginForm = () => {
    const { user, setUser } = useContext(UserContext)
    const [formData, setFormData] = useState({username: "", password: ""})
    const [processError, setProcessError] = useState()
    const [isPending, setIsPending] = useState(false)

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
        setIsPending(true)

        fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            credentials: 'include',
            body: JSON.stringify(formData)
        }).then((res) => {
            if (res.status === 402) {
                setProcessError('User is not registered!')
                setIsPending(false)
                return
            } else if (res.status === 401) {
                setProcessError('Incorrect password. Please try again!')
                setIsPending(false)
                return
            } else if (res.status === 200) {
                setIsPending(false)                
                res.json().then((data) => {
                    setUser(data.username)
                })
            } else {
                setProcessError("Ooops, there's an error on our side. Please try again later")
                setIsPending(false)
                return
            }
        }).catch((error) => {
            setIsPending(false)
            setProcessError("Ooops, there's an error on our side. Please try again later")
            return error
        })
    }

    return (
        <form className="login-form form" onSubmit={handleSubmit}>
            <input 
                type="text" 
                name="username" 
                onChange={handleChange} 
                placeholder="Username"
                value={formData.username}                
            />
            <input 
                type="password" 
                name="password" 
                onChange={handleChange} 
                placeholder="Password" 
                value={formData.password}                
            />

            {processError && <p className="form__process-error">{processError}</p>}
            {isPending ? <button className="form__button form__button--pending" type="submit" disabled>Sign in</button> : <button className="form__button" type="submit">Sign in</button>}
        </form>
    )
}

export default LoginForm