import React, { useContext, useState } from "react";
import { UserContext } from "../Services/UserContext"
import logout from "../Services/LogoutFunction";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const DeleteMe = (props) => {
    let navigate = useNavigate()
    const { user, setUser } = useContext(UserContext)
    const [ formData, setFormData] = useState({
        username: ''
    })
    const [ submitDisabled, setSubmitDisabled] = useState(true)

    const logMeOut = () => {
        logout()
        setUser(null)
        navigate('/')
    }

    const handleChange = (event) => {
        if (user === event.target.value) {
            setSubmitDisabled(false)
        } else {
            setSubmitDisabled(true)
        }
        setFormData((oldFormData) => {
            return {
                ...oldFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        fetch('http://localhost:3000/api/users/delete', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: user
            })
        })
        .then((res) => {
            if (res.status !== 200) {
                throw Error('service is currently not available')
            } else {
                return res.json()
            }
        })
        .then((data) => {
            console.log(data)
            logMeOut()
        })
        .catch((error) => {
            console.error(error)
        })
    }

    return (
        <div className="delete-prompt__wrapper" onClick={(event) => {if (event.target.className === 'delete-prompt__wrapper'){props.togglePrompt()}}}>
            <div className="delete-prompt" >
                <h3>Do you want to delete your user profile?</h3>
                <p>Type in your username below and hit the button</p>
                <p>Notice: doing so will permanently delete all your credentials.</p>
                <div className="delete-prompt__close-btn" onClick={props.togglePrompt} ><FontAwesomeIcon icon={faXmark}/></div>
                <form className="deleteme-form form" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="username" 
                        onChange={handleChange} 
                        placeholder={user}
                        value={formData.username}
                        />
                {submitDisabled ? 
                    <button type="submit" className="form__button form__button--disabled" disabled>Delete me</button> :
                    <button type="submit" className="form__button">Delete me</button>
                }
                </form>

            </div>
        </div>
    )
}

export default DeleteMe