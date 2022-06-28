import React, { useContext } from "react"
import { UserContext } from "../Services/UserContext"
import { Link } from "react-router-dom"
import Avatar from "./Avatar"
import createDateFormat from "../Services/createDateFormat"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faPuzzlePiece, faTrash } from '@fortawesome/free-solid-svg-icons'

const PostPreview = (props) => {
    let createdOnDate
    const { user, setUser } = useContext(UserContext)
    const commentButtonLabel = (commentNumber) => {
        if (commentNumber === 0) {
            return 'No comments'
        } else if (commentNumber === 1) {
            return '1 comment'
        } else {
            return `${commentNumber} comments`
        }
    }

    let commentLabel = commentButtonLabel(props.commentCount)
    let postUrl = `/posts/${props.postId}`
    let postModUrl = `/posts/${props.postId}/modify`

    const deletePost = (event) => {
        event.preventDefault()
        fetch(`http://localhost:3000/api/posts/${props.postId}`, {
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
            props.toggleReload()
        })
    }

    if (props.createdon) {
        createdOnDate = createDateFormat(props.createdon)
    }

    return (
        <Link to={postUrl} key={props.postId}>
            <div className="post">
                <div className="post__credentials">
                    <div className="post__credentials__userwrapper">
                        <Avatar pic={props.userpic} />
                        <div className="post__credentials__userwrapper__user">{props.username}</div>              
                    </div>     
                    
                    <div className="post__credentials__createdon">
                        {createdOnDate}
                    </div>
                </div>
                <h3 className="post__title">{props.title}</h3>

                {props.imgUrl ? 
                    <div className="post__wrapper">
                        <img className="post__wrapper__image" src={props.imgUrl} />
                    </div> 
                    : <div className="post__preview">{props.description}</div>
                }                
                
                <div className="post__buttons">
                    <div className="post__buttons__comments post__buttons__element"><FontAwesomeIcon icon={faMessage}/> {commentLabel}</div>
                    {props.username === user && <div className="post__buttons__modify post__buttons__element"><Link to={postModUrl}><FontAwesomeIcon icon={faPuzzlePiece}/> Modify</Link></div>}
                    {props.username === user && <div className="post__buttons__delete post__buttons__element" onClick={deletePost}><FontAwesomeIcon icon={faTrash}/> Delete</div>}                
                </div>
            </div>
        </Link>
    )
}

export default PostPreview