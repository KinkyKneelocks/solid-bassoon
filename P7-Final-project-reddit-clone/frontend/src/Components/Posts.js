import React, { useEffect, useState } from "react"
import PostPreview from "./PostPreview"

const Posts = () => {
    const [posts, setPosts] = useState([])
    const [toggleReload, setToggleReload] =useState(1)

    useEffect(() => {
        fetch('http://localhost:3000/api/posts/', {
            credentials: 'include',
        })
        .then(res => res.json())
        .then(data => setPosts(data))
        .catch((error) => {
            console.log(error)
        })
    }, [toggleReload])

    const toggleDelete = () => {
        setToggleReload(prevToggleReload => prevToggleReload +1)
    }

    let allPosts = posts.map((post) => {       
            return <PostPreview key={post.postId} createdon={post.createdOn} userpic={post.profilepic} title={post.Title} imgUrl={post.imgUrl} commentCount={post.commentCount} postId={post.postId} username={post.userName} description={post.Description} toggleReload={toggleDelete} /> 
    })

    return (
        
            <div className="posts-wrapper">
                {posts.length !== 0 ? allPosts : 'No posts to show'} 
            </div>           
        
    )
}

export default Posts