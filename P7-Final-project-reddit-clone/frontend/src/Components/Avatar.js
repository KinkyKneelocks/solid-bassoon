import React from "react";
import placeholder from "../Images/avatar-placeholder.webp"


const Avatar = (props) => {
    let avatarUrl = ( props.pic ? props.pic : placeholder )
    return (
        <div className="avatar">
            <img src={avatarUrl} className="avatar__pic" />            
        </div>
    )
}

export default Avatar