import React, { useContext } from "react";
import { UserContext } from "../Services/UserContext"
import { Link, useParams, useNavigate } from "react-router-dom"
import Avatar from "./Avatar";
import createDateFormat from "../Services/createDateFormat";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPuzzlePiece, faTrash } from '@fortawesome/free-solid-svg-icons'

const PostComplete = (props) => {
    const { user } = useContext(UserContext)
    let { postId } = useParams()
    let navigate = useNavigate() 
    let createdOnDate   

    const deletePost = (event) => {
        event.preventDefault()
        fetch(`http://localhost:3000/api/posts/${postId}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        .then((res) => {
            if (res.status !== 200) {
                throw Error('Delete action could not be completed')
            }
            return res.json()
        })
        .then((data) => {
            console.log('delete successful')
            navigate('/')
        })
        .catch(error => {
            console.log(error)
        })
    }
    if (props.createdon) {
        createdOnDate = createDateFormat(props.createdon)        
    }
    return (
        <article className="postsa">
            
           
            <div className="postsa__credentials">
                <div className="postsa__credentials__userwrapper">
                    <Avatar pic={props.userpic} />
                    <div className="postsa__credentials__userwrapper__user">{props.username}</div>              
                </div>     
                
                <div className="postsa__credentials__createdon">
                    {createdOnDate}
                </div>
            </div>
            <h1 className="postsa__title">{props.title}</h1>
            { props.imgurl && 
                <div className="postsa__image-wrapper">
                    <img src={props.imgurl} />
                </div>  
            }

            { props.text && <div className="postsa__text">{props.text}</div>}            

            { user === props.username && 
                <div className="postsa__controller">
                    <div className="postsa__controller__modify postsa__controller__element" data-post={props.postid}><Link to={`/posts/${postId}/modify`}><FontAwesomeIcon icon={faPuzzlePiece}/> Modify post</Link></div>
                    <div className="postsa__controller__delete postsa__controller__element" data-post={props.postid} onClick={deletePost} ><FontAwesomeIcon icon={faTrash}/> Delete post</div>
                </div>
            }
        </article>
    )
}

export default PostComplete