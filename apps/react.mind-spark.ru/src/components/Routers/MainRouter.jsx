import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import Home from '../../pages/Home';
import AuthGoogleCallback from '../../pages/Auth/Google/AuthGoogleCallback'
import Auth from '../../pages/Auth/Auth'
import BlankLayout from '../Layouts/BlankLayout';
import MainLayout from '../Layouts/MainLayout'


export default function MainRouter() {

  return (
  <Router>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route element={<BlankLayout />}>
        <Route path="/auth" element={<Auth />} />
      </Route>
      <Route element={<BlankLayout />}>
        <Route path="/auth/google" element={<AuthGoogleCallback />} />
      </Route>
    </Routes>
  </Router>
  )
}