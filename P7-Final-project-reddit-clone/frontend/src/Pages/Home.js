import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../Services/UserContext"

import Posts from "../Components/Posts"
import Login from "../Components/Login"


const Home = () => {
    const { user, setUser } = useContext(UserContext)

    return (
        <section>
            { user !== false && 
                (user ? <Posts /> : <Login />)
            }
        </section>
    )
}

export default Home