import React, { useContext } from "react";
import { UserContext } from "../Services/UserContext"
import { Link, useParams, useNavigate } from "react-router-dom"
import Avatar from "./Avatar";

const PostComplete = (props) => {
    const { user } = useContext(UserContext)
    let { postId } = useParams()
    let navigate = useNavigate()
    let modUrl = `/posts/${postId}/modify`

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
    }

    return (
        <section className="post">
            
           
            <div className="post__credentials">
                <div className="post__credentials__userwrapper">
                    <Avatar pic={props.userpic} />
                    <div className="post__credentials__userwrapper__user">{props.username}</div>              
                </div>     
                
                <div className="post__credentials__createdon">
                    {props.createdon}
                </div>
            </div>
            <h1 className="post__title">{props.title}</h1>
            { props.imgurl && 
                <div className="image-wrapper">
                    <img src={props.imgurl} />
                </div>  
            }

            { props.text && <div className="post__text">{props.text}</div>}            

            { user === props.username && 
                <div className="post__controller">
                    <div className="post__controller__modify" data-post={props.postid}><Link to={modUrl}>Modify post</Link></div>
                    <div className="post__controller__delete" data-post={props.postid} onClick={deletePost} >Delete post</div>
                </div>
            }
        </section>
    )
}

export default PostComplete