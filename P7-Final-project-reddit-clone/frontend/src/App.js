import './App.css';
import React, { useState, useMemo, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Nav from "./Components/Nav"
import Home from "./Pages/Home"
import Register from "./Pages/Register"
import CreatePost from './Pages/CreatePost';
import Profile from './Pages/Profile'
import { UserContext } from "./Services/UserContext"
import SinglePostView from './Pages/SinglePostView';
import ModifyPost from './Pages/ModifyPost';
import Footer from './Components/Footer'



function App() {
  const [user, setUser] = useState(false)

  const providerValue = useMemo(() => ({ user, setUser }), [user, setUser])

  
  useEffect(() => {
    fetch('http://localhost:3000/api/users/amiloggedin', {
      credentials: 'include'
    })
    .then((res) => {
      if (res.status !== 200) {
        setUser(null)
        console.log('no cookie')
        return
      } else {
        return res.json()
      }
    })
    .then((data) => {
      if (data) {
        setUser(data.username)
        console.log('user is logged in')
      }
    })
  }, [])
  
  

  return (
    <Router>
      <UserContext.Provider value={providerValue}>
        <Nav />

        <Routes>
          <Route path="/" element={<Home />} />          
          <Route path="/posts/:postId" element={<SinglePostView />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/createpost" element={<CreatePost />} />   
          <Route path="/posts/:postId/modify" element={<ModifyPost />} />
          <Route path="/profile" element={<Profile />} />    
        </Routes>
        
      </UserContext.Provider>
    </Router>
  );
}

export default App;
