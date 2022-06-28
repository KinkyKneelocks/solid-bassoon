import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../Services/UserContext"
import UserDataMenu from "./UserDataMenu"
import mobileLogo from "../Images/mobile-icon.svg"
import desktopLogo from "../Images/desktop-icon-left-font.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapSigns, faPlus } from '@fortawesome/free-solid-svg-icons'

const Nav = () => {
    const { user, setUser } = useContext(UserContext)
    const [width, setWidth] = useState(window.innerWidth)      
  
    
    useEffect(() => {

        const watchWidth = () => {
            setWidth(window.innerWidth)
        }

        window.addEventListener('resize', watchWidth)

        return () => {
            window.removeEventListener('resize', watchWidth)
        }

    }, [])
    
    

    return (
        <header>
            
            <div className="logo">
                <img src={width > 600 ? desktopLogo : mobileLogo} />
            </div>

            { user ?
            <nav className="nav">
                <div className="nav__buttons">
                    <Link key="posts" to="/"><FontAwesomeIcon icon={faMapSigns} />{ width > 450 && 'Posts' }</Link>
                    <Link key="createpost" to="/createpost"><FontAwesomeIcon icon={faPlus} />{ width > 450 && 'New post' }</Link>
                </div>
                <UserDataMenu />
            </nav> 
            :             
            <nav className="nav nav--alt">
                <div className="nav__buttons">
                    <Link key="login" to="/">Login</Link>
                    <Link key="register" to="/register">Register</Link>
                </div>
            </nav> }
        </header>
    )
}

export default Nav