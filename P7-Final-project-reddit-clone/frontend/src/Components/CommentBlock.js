import React, { useContext } from "react";
import { UserContext } from "../Services/UserContext"
import Avatar from "./Avatar";

const CommentBlock = (props) => {
    const { user } = useContext(UserContext)

    const deleteComment = () => {
        let fetchDeleteComment = `http://localhost:3000/api/posts/comments/${props.commentid}`
        fetch(fetchDeleteComment, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json"},
            credentials: 'include',
            body: JSON.stringify({username: user})
        })
        .then((res) => {
            if (res.status !== 200) {
                throw Error ('Service is currently unavailable. Try again later!')
            } else {
                props.toggleReload()
                return res.json()
            }
        })
        .then(data => console.log(data))
        .catch((Error) => {
            console.error(Error)
        })
    }

    return (
        <div className="comment" id={props.commentid}>
            <div className="comment__credentials">
                <div className="comment__credentials__userwrapper">
                    <Avatar pic={props.userpic} />
                    <div className="comment__credentials__userwrapper__user">{props.username}</div>                
                </div>
                <div className="comment__credentials__date">{props.createdon}</div>
                
            </div>
            <div className="comment__content">
                {props.text}
            </div>
            { user === props.username &&
            <div className="comment__controller">
                <div className="comment__controller__delete" data-commentid={props.commentid} onClick={deleteComment} >Delete comment</div>
            </div>
            }
        </div>
    )
}

export default CommentBlock