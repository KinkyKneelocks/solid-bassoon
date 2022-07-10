import React from "react";
import placeholder from "../Images/avatar-placeholder.webp"


const Avatar = (props) => {
    let avatarUrl
    if (props.pic !== 'null') {
        avatarUrl = ( props.pic ? props.pic : placeholder )
    } else {
        avatarUrl = placeholder
    }
    return (
        <div className="avatar">
            <img alt="" src={avatarUrl} className="avatar__pic" />            
        </div>
    )
}

export default Avatar