import React, { useContext } from "react"
import { UserContext } from "../Services/UserContext"
import { Link } from "react-router-dom"

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

    return (
        <Link to={postUrl}>
            <div className="post imagepost">
                <h3 className="post__title">{props.title}</h3>

                {props.imgUrl ? 
                    <div className="post__wrapper">
                        <img className="post__wrapper__image" src={props.imgUrl} />
                    </div> 
                    : <div className="post__preview">{props.description}</div>
                }                
                
                <div className="post__buttons">
                    <div className="post__buttons__comments">{commentLabel}</div>
                    {props.userName === user && <div className="post__buttons__delete">Modify post</div>}
                    {props.userName === user && <div className="post__buttons__delete">Delete post</div>}                
                </div>
            </div>
        </Link>
    )
}

export default PostPreview