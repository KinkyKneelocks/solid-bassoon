import React, { useContext, useState } from "react";
import { UserContext } from "../Services/UserContext"
import { Link, useParams, useNavigate } from "react-router-dom"
import Avatar from "./Avatar";
import createDateFormat from "../Services/createDateFormat";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPuzzlePiece, faTrash, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'

const PostComplete = (props) => {
    const [likes, setLikes] = useState(() => { return props.likes })
    const [dislikes, setDislikes] = useState(() => { return props.dislikes })
    const [ownLike, setOwnLike] = useState(() => { return props.ownLike })
    const [ownDislike, setOwnDislike] = useState(() => { return props.ownDislike })
    const { user } = useContext(UserContext)
    let { postId } = useParams()
    let navigate = useNavigate() 
    let createdOnDate  
    
    const toggleReaction = (event) => {
        event.preventDefault();        
        let reactionvalue        
        let payload = {
            postId: postId
        }
        if (event.target.classList.contains('postsa__controller__element')) {        
        reactionvalue = event.target.dataset.reactionvalue
        } else {
        reactionvalue = event.target.closest('.postsa__controller__element').dataset.reactionvalue
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


                <div className="postsa__controller">
                    <div onClick={toggleReaction} data-reactionvalue="1" className={ownLike == 1 ? "postsa__controller__element postsa__controller__element__active-like" : "postsa__controller__element"}>
                        <FontAwesomeIcon icon={faThumbsUp} /> {likes}
                    </div>
                    <div onClick={toggleReaction} data-reactionvalue="-1" className={ownDislike == 1 ? "postsa__controller__element postsa__controller__element__active-dislike" : "postsa__controller__element"}>
                        <FontAwesomeIcon icon={faThumbsDown} /> {dislikes}
                    </div>
                    
                    { user === props.username && <div className="postsa__controller__modify postsa__controller__element" data-post={props.postid}><Link to={`/posts/${postId}/modify`}><FontAwesomeIcon icon={faPuzzlePiece}/> Modify post</Link></div> }
                    { user === props.username && <div className="postsa__controller__delete postsa__controller__element" data-post={props.postid} onClick={deletePost} ><FontAwesomeIcon icon={faTrash}/> Delete post</div> }
                </div>

        </article>
    )
}

export default PostComplete