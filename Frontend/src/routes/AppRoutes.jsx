import React from 'react'
import {Route,BrowserRouter,Routes} from 'react-router-dom'
import Login from '../screens/Login.jsx'
import Register from '../screens/Register.jsx'
const AppRoutes = () => {
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<div>Home</div>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/Register" element={<Register/>}/>
   </Routes>
   </BrowserRouter>
  )
}

export default AppRoutes
