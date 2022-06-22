import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import CommentBlock from "../Components/CommentBlock"
import PostComplete from "../Components/PostComplete"
import AddCommentForm from "../Components/AddCommentForm"

const SinglePostView = () => {    
    let { postId } = useParams()
    const [postData, setPostData] = useState({})
    const [commentData, setCommentData] = useState([])
    const [toggleCommentReload, setToggleCommentReload] = useState(1)   

    console.log(commentData)
    console.log(postData)


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
        <main>
            <PostComplete 
                username={postData.userName} 
                title={postData.Title} 
                imgurl={postData.imgUrl} 
                postid={postData.postId} 
                text={postData.Description} 
                createdon={postData.createdOn} 
                userpic={postData.profilepic}
                />

            <div>
                <AddCommentForm postId={postId} toggleReload={renderComments} />               
            </div>


            <div className="comments">
                {allComments}
            </div>
        </main>
    )
}

export default SinglePostView