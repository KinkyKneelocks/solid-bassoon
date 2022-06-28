import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../Services/UserContext"
import logout from "../Services/LogoutFunction";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faArrowRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons'

const UserDataMenu = () => {
    let navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const { user, setUser } = useContext(UserContext)

    const openMenu = () => {
        setMenuOpen(prevMenuOpen => !prevMenuOpen)
    }

    const logMeOut = () => {
        logout()
        setUser(null)
        navigate('/')
    }

    const navigateToPage = (page) => {
        setMenuOpen(prevMenuOpen => !prevMenuOpen)
        navigate(page)
    }

    return (
        <div className="nav__credentials">
            <div className={ menuOpen ? "nav__credentials__top nav__credentials__top--open" : "nav__credentials__top"} onClick={openMenu}>
            Hello there, <b>{ user }</b> <FontAwesomeIcon icon={faAngleDown} />
            </div>
            { menuOpen && 
                <div className="nav__credentials__menu">
                <div className="nav__credentials__menu__element" onClick={() => {navigateToPage('/profile')}}><FontAwesomeIcon icon={faUser} /> My profile</div>
                <div className="nav__credentials__menu__element nav__credentials__menu__element--logout" onClick={logMeOut}><FontAwesomeIcon icon={faArrowRightFromBracket}/> Logout</div>
                </div>
            }

        </div>
    )
}

export default UserDataMenu