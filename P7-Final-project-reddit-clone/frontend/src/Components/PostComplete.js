import React, { useContext } from "react";
import { UserContext } from "../Services/UserContext"

const PostComplete = (props) => {
    const { user } = useContext(UserContext)

    return (
        <section className="post">
            
            <h1 className="post__title">{props.title}</h1>
            <div className="post__credentials">
                <div className="post__credentials__username">{props.username}</div>
                <div className="post__credentials__createdon">{props.createdon}</div>
            </div>
            { props.imgurl && 
                <div className="image-wrapper">
                    <img src={props.imgurl} />
                </div>  
            }

            { props.text && <div className="post__text">{props.text}</div>}            

            { user === props.username && 
                <div className="post__controller">
                    <div className="post__controller__modify" data-post={props.postid}>Modify post</div>
                    <div className="post__controller__delete" data-post={props.postid}>Delete post</div>
                </div>
            }
        </section>
    )
}

export default PostComplete