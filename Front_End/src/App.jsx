import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashBoard from './pages/DashBoard';


function App() {
  return (
    <Routes >
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/dashboard' element={<DashBoard/>} />
    </Routes>
  )
}

export default App