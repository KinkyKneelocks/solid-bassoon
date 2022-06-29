import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Services/UserContext"
import { useNavigate } from "react-router-dom"
import logout from "../Services/LogoutFunction";
import placeholder from "../Images/avatar-placeholder.webp"
import Dropzone from "react-dropzone"
import e from "cors";
import DeleteMe from "../Components/DeleteMe";
import ChangePasswordForm from "../Components/ChangePasswordForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiagramNext } from '@fortawesome/free-solid-svg-icons'

const Profile = () => {
    let navigate = useNavigate()
    const { user, setUser } = useContext(UserContext)
    const [userData, setUserData] = useState({
        username: '',
        file: ''
    })
    const [dropzoneLabel, setDropzoneLabel] = useState("Click here to change your profile picture")    
    const [previewImage, setPreviewImage] = useState()
    const [usernameEditor, setUsernameEditor] = useState(false)
    const [ deletePromptOpen, setDeletePromptOpen] = useState(false)    

    console.log(userData)
    

    useEffect(() => {
        fetch(`http://localhost:3000/api/users/user`, {
            method: 'POST',
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
                throw Error('user cannot be found!')
            }
            return res.json()
        })
        .then((data) => {           
            setUserData(data[0])
            if (data[0].profilepic === null) {
                setPreviewImage(placeholder)
            } else {
                setPreviewImage(data[0].profilepic)
            }
        })
        .catch((Error) => {
            console.error(Error)
        })
    }, [])

    const logMeOut = () => {
        logout()
        setUser(null)
        navigate('/')
    }

    const openDeletePrompt = () => {
        setDeletePromptOpen((prevDeletePromptOpen => !prevDeletePromptOpen))
    }

    const handleChange = (event, dropfile) => {
        let customValue
        if (dropfile) {
            customValue = dropfile
            setUserData(prevFormData => {
                return {
                    ...prevFormData,
                    file: customValue
                }
            })
        } else {
            customValue = event.target.value
            setUserData(prevFormData => {
                return {
                    ...prevFormData,
                    [event.target.name]: customValue
                }
            })
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!userData.file && userData.userName) {
            fetch('http://localhost:3000/api/users/changeusername', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    newusername: userData.userName,
                    username: user
                })
            })
            .then((res) => {
                if (res.status !== 200) {
                    throw Error('Service currently not available')
                } else {
                    return res.json()
                }
            })
            .then((data) => {
                logMeOut()
            })
            .catch(error => {console.error(error)})
        }
        
        if (userData.file && (!userData.userName || user === userData.userName)) {
            const fd = new FormData()
            fd.append('username', user)      
            fd.append('file', userData.file, userData.file.name)

            fetch('http://localhost:3000/api/users/changeprofilepic', {
                method: 'PUT',
                credentials: 'include',
                body: fd
            })
            .then((res) => {
                if (res.status !== 200) {
                    throw Error('Service currently not available')
                } else {
                    navigate('/')
                }  
            })
            .catch(error => {console.error(error)})
        }

        if (userData.file && userData.userName && (userData.userName !== user)) {
            const fd = new FormData()
            fd.append('username', userData.userName)      
            fd.append('file', userData.file, userData.file.name)

            fetch('http://localhost:3000/api/users/changeusername', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    newusername: userData.userName,
                    username: user
                })
            })
            .then((res) => {
                if (res.status === 200) {
                    return res.json()
                } else {
                    throw Error('service is currently not available')
                }
            })
            .then((data) => {
                return fetch('http://localhost:3000/api/users/changeprofilepic', {
                    method: 'PUT',
                    credentials: 'include',
                    body: fd
                })
            })
            .then((res) => {
                if (res.status === 200) {
                    return res.json()
                } else {
                    throw Error('service is currently not available')
                }
            })
            .then((data) => {
                logMeOut()
            })
        }
    }

    const showForm = () => {
        setUsernameEditor(true)
    }


    return (
        <section className="profile-page">
            <h3>Change your userprofile below!</h3>
            { deletePromptOpen && <DeleteMe togglePrompt={openDeletePrompt} /> }

            <form className="form user-form" onSubmit={handleSubmit}>
            <div className="form__user__wrapper">
                { !usernameEditor ? 
                    <div className="form__user__username" onClick={showForm}>{userData.userName}</div>
                    :  
                    <input 
                        type="text" 
                        placeholder="username"
                        name="userName"
                        onChange={handleChange}
                        value={userData.userName}
                    />
                }
            </div>

            <Dropzone 
                className={"form__dropzone"}
                onDrop={(files) => {                    
                    handleChange(e, files[0])                                       
                    setPreviewImage(URL.createObjectURL(files[0]))                    
                }}
                maxFiles={1} 
                accept={{
                    'image/jpg': ['.jpg', '.jpeg'],
                    'image/png': ['.png']
                }}
                >
                    {({getRootProps, getInputProps}) => (
                        <div {...getRootProps()} className="form__dropzone form__dropzone--active">
                            <input {...getInputProps()} name="file" />
                            <p>{dropzoneLabel}</p>
                            { previewImage && <div className="form__previewwrapper"><FontAwesomeIcon className="form__previewwrapper__icon" icon={faDiagramNext} /><img className="form__previewwrapper__previewImage" src={previewImage} /></div> }
                            </div>
                )}
            </Dropzone>

            <button className="form__button" type="submit">Change my look!</button>

            </form>
            <div className="misc-buttons">
                <button className="form__button form__button--alt" onClick={logMeOut}>Log me out</button>
                <button className="form__button form__button--alt" onClick={openDeletePrompt} > Delete me</button>
            </div>
            <h3>Change your password here!</h3>
            <ChangePasswordForm />
        </section>
    )
}

export default Profile