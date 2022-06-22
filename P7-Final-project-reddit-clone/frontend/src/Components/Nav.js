import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../Services/UserContext"
import UserDataMenu from "./UserDataMenu"

const Nav = () => {
    const { user, setUser } = useContext(UserContext)

    return (
        <header>
            { user ?
            <nav className="nav">
                <div className="nav__buttons">
                    <Link key="posts" to="/">Posts</Link>
                    <Link key="createpost" to="/createpost">Add new posts</Link>
                </div>
                <UserDataMenu />
            </nav> 
            :             
            <nav className="nav">
                <Link key="login" to="/">Login</Link>
                <Link key="register" to="/register">Register</Link>
            </nav> }
        </header>
    )
}

export default Nav