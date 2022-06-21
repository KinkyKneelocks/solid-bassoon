import './App.css';
import React, { useState, useMemo } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Nav from "./Components/Nav"
import Home from "./Pages/Home"
import Register from "./Pages/Register"
import CreatePost from './Pages/CreatePost';
import { UserContext } from "./Services/UserContext"
import SinglePostView from './Pages/SinglePostView';

function App() {
  const [user, setUser] = useState(null)
  const providerValue = useMemo(() => ({ user, setUser }), [user, setUser])

  return (
    <Router>
      <UserContext.Provider value={providerValue}>
        <Nav />

        <Routes>
          <Route path="/" element={<Home />} />          
          <Route path="/posts/:postId" element={<SinglePostView />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/createpost" element={<CreatePost />} />       
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
