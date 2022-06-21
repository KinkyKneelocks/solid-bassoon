import React, { useState, useContext } from "react";
import { UserContext } from "../Services/UserContext"
import { useNavigate } from "react-router-dom"

const SubmitPostForm = () => {
    let navigate = useNavigate()
    const { user, setUser } = useContext(UserContext)
    const [isPending, setIsPending] = useState(false)
    const [formData, setFormData] = useState({
        userName: user,
        title: '',
        desc: '',
        file: null
    })

    const handleChange = (event) => {
        let customValue
        if (event.target.name === 'file') {
            customValue = event.target.files[0]
        } else {
            customValue = event.target.value
        }
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: customValue
            }
        })
    }

    const handleSubmit = (event) => {
        let fetchOptions
        setIsPending(true)
        event.preventDefault()
        if (!formData.file) {
            fetchOptions = {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    userName: formData.userName,
                    title: formData.title,
                    desc: formData.desc
                })
            }
        } else {
            const fd = new FormData()
            fd.append('userName', formData.userName)
            fd.append('title', formData.title)
            fd.append('desc', formData.desc)        
            fd.append('file', formData.file, formData.file.name)

            fetchOptions = {
                method: 'POST',
                credentials: 'include',
                body: fd
            }
        }
        fetch('http://localhost:3000/api/posts/', fetchOptions)
        .then((res) => {
            if (res.status === 200) {
                console.log('success')
                setIsPending(false)
                navigate('/')
            } else {
                setIsPending(false)
                console.log('failure')
            }
        })
    }

    return (
        <form className="postsubmit-form form" onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Title (required)"
                name="title"
                onChange={handleChange}
                value={formData.title}
            />
            <textarea                 
                placeholder="Text"
                name="desc"
                onChange={handleChange}
                value={formData.desc}
            />
            <input 
                type="file"
                name="file"
                onChange={handleChange}                
            />

            {isPending ? 
                <button className="form__button form__button--pending" type="submit" disabled>Submit</button> : 
                <button className="form__button" type="submit">Submit</button>
            }
        </form>
    )
}

export default SubmitPostForm