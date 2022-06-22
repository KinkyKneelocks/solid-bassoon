import React, { useContext } from "react"
import { UserContext } from "../Services/UserContext"
import { Link } from "react-router-dom"
import Avatar from "./Avatar"

const PostPreview = (props) => {
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

    return (
        <Link to={postUrl} key={props.postId}>
            <div className="post">
                <div className="post__credentials">
                    <div className="post__credentials__userwrapper">
                        <Avatar pic={props.userpic} />
                        <div className="post__credentials__userwrapper__user">{props.username}</div>              
                    </div>     
                    
                    <div className="post__credentials__createdon">
                        {props.createdon}
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
                    <div className="post__buttons__comments">{commentLabel}</div>
                    {props.userName === user && <div className="post__buttons__delete"><Link to={postModUrl}>Modify</Link></div>}
                    {props.userName === user && <div className="post__buttons__delete" onClick={deletePost}>Delete</div>}                
                </div>
            </div>
        </Link>
    )
}

export default PostPreview