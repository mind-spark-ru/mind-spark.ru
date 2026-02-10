import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import Home from '../../pages/Home';
import AuthGoogleCallback from '../../pages/Auth/Google/AuthGoogleCallback'
import Auth from '../../pages/Auth/Auth'


export default function MainRouter() {

  return (
  <Router>
    <nav>
      <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
      <Link to="/auth" style={{ marginRight: '15px' }}>Auth</Link>
    </nav>

    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/auth" element={<Auth/>}></Route>
      <Route path="/auth/google" element={<AuthGoogleCallback/>}></Route>
    </Routes>
    <footer>
      <div>
        <p>© 2025 MindSpark. All rights reserved.</p>
      </div>
    </footer>
  </Router>
  )
}