import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCat } from '@fortawesome/free-solid-svg-icons'

const NoComment = () => {
    return (
        <div className="nocomment">
            <div className="nocomment__icon">
                <FontAwesomeIcon icon={faCat} />
            </div>

            <div className="nocomment__text">
                Ooops... looks like there are no comments here. Write one now, quick!
            </div>
        </div>
    )
}

export default NoComment