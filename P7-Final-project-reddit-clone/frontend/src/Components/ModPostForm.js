import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../Services/UserContext"
import { useNavigate, useParams } from "react-router-dom"
import Dropzone, { useDropzone } from "react-dropzone"
import e from "cors";


const ModPostForm = () => {
    let navigate = useNavigate()
    const { user, setUser } = useContext(UserContext)
    let { postId } = useParams()
    const [isPending, setIsPending] = useState(false)
    const [dropzoneLabel, setDropzoneLabel] = useState("Drag 'n' drop some files here, or click to select files")
    const [dropzoneIsActive, setDropzoneIsActive] = useState(false)
    const [previewImage, setPreviewImage] = useState()
    const [formData, setFormData] = useState({
        userName: user,
        title: '',
        desc: '',
        file: null
    })

    useEffect(() => {
        fetch(`http://localhost:3000/api/posts/${postId}`)
        .then((res) => {
            if (res.status !== 200) {
                throw Error('Cannot get post data')
                setIsPending(true)
            }
            return res.json()
        })
        .then((data) => {
            console.log(data[0])
            setFormData((prevFormData) => {
                return (
                    {...prevFormData,
                    title: data[0].Title,
                    desc: data[0].Description
                    }
                )
            })
            setPreviewImage(data[0].imgUrl)
        })
        .catch((Error) => {
            console.error(Error)
        })
    }, [])

    

    const handleChange = (event, dropfile) => {
        let customValue
        if (dropfile) {
            console.log(dropfile)
            customValue = dropfile
            setFormData(prevFormData => {
                return {
                    ...prevFormData,
                    file: customValue
                }
            })
        } else {
            customValue = event.target.value
            setFormData(prevFormData => {
                return {
                    ...prevFormData,
                    [event.target.name]: customValue
                }
            })
        }
    }

    const handleSubmit = (event) => {
        let fetchOptions
        setIsPending(true)
        event.preventDefault()
        if (!formData.file) {
            fetchOptions = {
                method: 'PUT',
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
                method: 'PUT',
                credentials: 'include',
                body: fd
            }
        }
        fetch(`http://localhost:3000/api/posts/${postId}`, fetchOptions)
        .then((res) => {
            if (res.status === 200) {
                console.log('success')
                setIsPending(false)
                navigate(`/posts/${postId}`)
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

            <Dropzone 
                className={"form__dropzone"}
                onDrop={(files) => {                    
                    handleChange(e, files[0])
                    setDropzoneLabel(files[0].name)
                    setDropzoneIsActive(true)                    
                    setPreviewImage(URL.createObjectURL(files[0]))                    
                }}
                maxFiles={1} 
                accept={{
                    'image/jpg': ['.jpg', '.jpeg'],
                    'image/png': ['.png']
                }}
                >
                    {({getRootProps, getInputProps}) => (
                        <div {...getRootProps()} className={ dropzoneIsActive ? "form__dropzone form__dropzone--active" : "form__dropzone"}>
                            <input {...getInputProps()} name="file" />
                            <p>{dropzoneLabel}</p>
                            { previewImage && <div className="form__previewwrapper"><img className="form__previewwrapper__previewImage" src={previewImage} /></div> }
                            </div>
                )}
            </Dropzone>
                
            
            

            {isPending ? 
                <button className="form__button form__button--pending" type="submit" disabled>Submit</button> : 
                <button className="form__button" type="submit">Submit</button>
            }



        </form>
    )
}

export default ModPostForm