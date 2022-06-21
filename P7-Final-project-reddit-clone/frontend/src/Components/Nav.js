import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../Services/UserContext"

const Nav = () => {
    const { user, setUser } = useContext(UserContext)
    const loggedInMenu = [<Link key="posts" to="/">Posts</Link>, <Link key="createpost" to="/createpost">Add new posts</Link>, <p>Hello there, { user }</p>]
    const loggedOutMenu = [<Link key="login" to="/">Login</Link>, <Link key="register" to="/register">Register</Link>]

    return (
        <nav>
            { user ? loggedInMenu : loggedOutMenu }
        </nav>
    )
}

export default Nav