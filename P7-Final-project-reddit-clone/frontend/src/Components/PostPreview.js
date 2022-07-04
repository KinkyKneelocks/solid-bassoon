import React, { useContext, useState } from "react"
import { UserContext } from "../Services/UserContext"
import { Link } from "react-router-dom"
import Avatar from "./Avatar"
import createDateFormat from "../Services/createDateFormat"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faPuzzlePiece, faTrash, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'

const PostPreview = (props) => {
    const [likes, setLikes] = useState(props.likes)
    const [dislikes, setDislikes] = useState(props.dislikes)
    const [ownLike, setOwnLike] = useState(props.ownLike)
    const [ownDislike, setOwnDislike] = useState(props.ownDislike)
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

    const toggleReaction = (event) => {
        event.preventDefault();
        let reactionvalue
        let postId = event.target.closest('.post').dataset.postid
        let payload = {
            postId: postId
        }
        if (event.target.classList.contains('post__buttons__element')) {        
        reactionvalue = event.target.dataset.reactionvalue
        } else {
        reactionvalue = event.target.closest('.post__buttons__element').dataset.reactionvalue
        }
        if (ownDislike == 0 && ownLike == 0 && reactionvalue == 1) /*User wants to like */ { 
            payload.previous = 0
            payload.desired = 1
            setLikes(prevLikes => prevLikes +1) 
            setOwnLike(1)
        } else
        if (ownDislike == 0 && ownLike == 0 && reactionvalue == -1) /*User wants to dislike */ { 
            payload.previous = 0
            payload.desired = -1
            setDislikes(prevDisikes => prevDisikes +1) 
            setOwnDislike(1)
        } else 
        if (ownDislike == 0 && ownLike == 1 && reactionvalue == 1) /*User wants to remove like */ { 
            payload.previous = 1
            payload.desired = 0
            setLikes(prevLikes => prevLikes -1) 
            setOwnLike(0)
        } else 
        if (ownDislike == 1 && ownLike == 0 && reactionvalue == -1) /*User wants to remove dislike */ {
            payload.previous = -1 
            payload.desired = 0
            setDislikes(prevDisikes => prevDisikes -1)
            setOwnDislike(0)
        } else 
        if (ownDislike == 1 && ownLike == 0 && reactionvalue == 1) /*User has disliked and wants to like */ { 
            payload.previous = -1
            payload.desired = 1
            setLikes(prevLikes => prevLikes +1) 
            setDislikes(prevDisikes => prevDisikes -1)
            setOwnLike(1)
            setOwnDislike(0)
        } else
        if (ownDislike == 0 && ownLike == 1 && reactionvalue == -1) /*User has liked and wants to dislike */ { 
            payload.previous = 1
            payload.desired = -1
            setLikes(prevLikes => prevLikes -1) 
            setDislikes(prevDisikes => prevDisikes +1)
            setOwnLike(0)
            setOwnDislike(1)
        } 
    }

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
            <div className="post" data-postid={props.postId}>
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
                    <div onClick={toggleReaction} data-reactionvalue="1" className={ownLike == 1 ? "post__buttons__element post__buttons__element__active-like" : "post__buttons__element"}>
                        <FontAwesomeIcon icon={faThumbsUp} /> {likes}
                    </div>
                    <div onClick={toggleReaction} data-reactionvalue="-1" className={ownDislike == 1 ? "post__buttons__element post__buttons__element__active-dislike" : "post__buttons__element"}>
                        <FontAwesomeIcon icon={faThumbsDown} /> {dislikes}
                    </div>
                    <div className="post__buttons__comments post__buttons__element">
   
                        <FontAwesomeIcon icon={faMessage}/> {commentLabel}</div>
                    {props.username === user && <div className="post__buttons__modify post__buttons__element"><Link to={postModUrl}><FontAwesomeIcon icon={faPuzzlePiece}/> Modify</Link></div>}
                    {props.username === user && <div className="post__buttons__delete post__buttons__element" onClick={deletePost}><FontAwesomeIcon icon={faTrash}/> Delete</div>}                
                </div>
            </div>
        </Link>
    )
}

export default PostPreview