import React, { useContext, useState } from "react";
import { UserContext } from "../Services/UserContext"

const AddCommentForm = (props) => {
    const { user } = useContext(UserContext)
    const [formData, setFormData] = useState({
        commentText: '',
        userName: user,
        postId: props.postId        
    })
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

        fetch('http://localhost:3000/api/posts/comments', {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            credentials: 'include',
            body: JSON.stringify(formData)
        })
        .then((res) => {
            if (res.status !== 200) {
                setProcessError('Service is currently unavailable. Try again later!')
                setIsPending(false)                
                throw Error ('Service is currently unavailable. Try again later!')
            } else {
                console.log('success')
                setIsPending(false)
                setProcessError()
                props.toggleReload()
                setFormData(prevFormData => {
                    return {
                        ...prevFormData,
                        commentText: ''
                    }
                })
            }
        }).catch((error) => {
            console.error(error)
        })
    }

    return (
        <form className="comment-form form" onSubmit={handleSubmit}>
            <textarea 
                value={formData.commentText} 
                placeholder="Add your comment here"
                name="commentText"
                onChange={handleChange}
            />

            {processError && <p className="form__process-error">{processError}</p>}
            { isPending ? 
            <button className="form__button form__button--pending" type="submit" disabled>Comment</button> : 
            <button className="form__button" type="submit">Comment</button> }
        </form>
    )
}

export default AddCommentForm