import React from "react";
import mobileLogo from "../Images/mobile-icon.svg"

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__image">
                <img src={mobileLogo} />
            </div>
            <div className="footer__text">
                Groupomania 2022.
            </div>
        </footer>
    )
}

export default Footer