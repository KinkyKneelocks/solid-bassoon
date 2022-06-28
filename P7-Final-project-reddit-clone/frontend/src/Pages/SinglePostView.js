import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import CommentBlock from "../Components/CommentBlock"
import PostComplete from "../Components/PostComplete"
import AddCommentForm from "../Components/AddCommentForm"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons'

const SinglePostView = () => {  
    let navigate = useNavigate()  
    let { postId } = useParams()
    const [postData, setPostData] = useState({})
    const [commentData, setCommentData] = useState([])
    const [toggleCommentReload, setToggleCommentReload] = useState(1)

    useEffect(() => {
        let fetchPostData = fetch(`http://localhost:3000/api/posts/${postId}`)
        let fetchCommentData = fetch(`http://localhost:3000/api/posts/comments/${postId}`)

        Promise.all([fetchPostData, fetchCommentData])
        .then(values => {
            return Promise.all(values.map(r => r.json()))
        })
        .then(([postData, commentData]) => {            
            setPostData(postData[0])
            setCommentData(commentData)
        })
        .catch((error) => {
            console.error(error)
        })
    }, [])

    useEffect(() => {
        let fetchCommentData = `http://localhost:3000/api/posts/comments/${postId}`
        fetch(fetchCommentData, {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             }      
          })
        .then((response) => {
            if (response.status === 200) {
                return response.json()
            } else {
                throw Error('Could not fetch comments')
            }
        })
        .then(data => setCommentData(data))        
    }, [toggleCommentReload])

    const renderComments = () => {
        setToggleCommentReload((prevValue) => {
            return prevValue + 1
        })
    }

    let allComments = commentData.map((comment) => {
        return <CommentBlock username={comment.userName} text={comment.commentText} createdon={comment.createdOn} commentid={comment.commentId} toggleReload={renderComments} userpic={comment.profilepic} />
    })

    return (
        <section>
            <div className="back-button">
                <div className="back-button__content" onClick={() => navigate('/')}>
                    <FontAwesomeIcon icon={faAnglesLeft}/> <b>All posts</b>
                </div>
            </div>
            <PostComplete 
                username={postData.userName} 
                title={postData.Title} 
                imgurl={postData.imgUrl} 
                postid={postData.postId} 
                text={postData.Description} 
                createdon={postData.createdOn} 
                userpic={postData.profilepic}
                />

            <section>
                <AddCommentForm postId={postId} toggleReload={renderComments} />               
            </section>


            <section className="comments">
                {allComments}
            </section>
        </section>
    )
}

export default SinglePostView