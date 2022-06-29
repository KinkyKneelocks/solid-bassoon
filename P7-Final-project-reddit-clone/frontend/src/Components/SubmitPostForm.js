import React, { useState, useContext, useCallback } from "react";
import { UserContext } from "../Services/UserContext"
import { useNavigate } from "react-router-dom"
import Dropzone, { useDropzone } from "react-dropzone"
import e from "cors";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiagramNext } from '@fortawesome/free-solid-svg-icons'


const SubmitPostForm = () => {
    let navigate = useNavigate()
    const { user, setUser } = useContext(UserContext)
    const [isPending, setIsPending] = useState(false)
    const [dropzoneLabel, setDropzoneLabel] = useState("Drag 'n' drop some files here, or click to select files")
    const [dropzoneIsActive, setDropzoneIsActive] = useState(false)
    const [previewImage, setPreviewImage] = useState()
    const [showIcon, setShowIcon] = useState(true)
    const [formData, setFormData] = useState({
        userName: user,
        title: '',
        desc: '',
        file: null
    })

    console.log(formData)

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

            <Dropzone 
                className={"form__dropzone"}
                onDrop={(files) => {                    
                    handleChange(e, files[0])
                    setDropzoneLabel(files[0].name)
                    setDropzoneIsActive(true)
                    setShowIcon(false)                    
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
                            {showIcon && <p className="form__dropzone__icon"> <FontAwesomeIcon icon={faDiagramNext}/></p>}                            
                            <p className="form__dropzone__label">{dropzoneLabel}</p>
                            { previewImage && <div className="form__previewwrapper"><FontAwesomeIcon className="form__previewwrapper__icon" icon={faDiagramNext} /><img className="form__previewwrapper__previewImage" src={previewImage} /></div> }
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

export default SubmitPostForm