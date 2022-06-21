import React, { useEffect, useState } from "react"
import PostPreview from "./PostPreview"

const Posts = () => {
    const [posts, setPosts] = useState([])

    console.log(posts)

    useEffect(() => {
        fetch('http://localhost:3000/api/posts/')
        .then(res => res.json())
        .then(data => setPosts(data))
        .catch((error) => {
            console.log(error)
        })
    }, [])

    let allPosts = posts.map((post) => {       
            return <PostPreview title={post.Title} imgUrl={post.imgUrl} commentCount={post.commentCount} postId={post.postId} userName={post.userName} description={post.Description} /> 
    })

    return (
        <main>
            <div className="posts-wrapper">
                {posts.length !== 0 ? allPosts : 'No posts to show'} 
            </div>           
        </main>
    )
}

export default Posts