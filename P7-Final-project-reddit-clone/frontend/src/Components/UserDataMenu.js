import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../Services/UserContext"
import logout from "../Services/LogoutFunction";

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
            <div className="nav__credentials__top" onClick={openMenu}>
            Hello there, { user }
            </div>
            { menuOpen && 
                <div className="nav__credentials__menu">
                <div className="nav__credentials__menu__element" onClick={() => {navigateToPage('/profile')}}>My profile</div>
                <div className="nav__credentials__menu__element" onClick={logMeOut}>Logout</div>
                </div>
            }

        </div>
    )
}

export default UserDataMenu