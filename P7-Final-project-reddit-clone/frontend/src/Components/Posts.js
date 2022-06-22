import React, { useEffect, useState } from "react"
import PostPreview from "./PostPreview"

const Posts = () => {
    const [posts, setPosts] = useState([])
    const [toggleReload, setToggleReload] =useState(1)

    console.log(posts)

    useEffect(() => {
        fetch('http://localhost:3000/api/posts/')
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
            return <PostPreview createdon={post.createdon} userpic={post.profilepic} title={post.Title} imgUrl={post.imgUrl} commentCount={post.commentCount} postId={post.postId} username={post.userName} description={post.Description} toggleReload={toggleDelete} /> 
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