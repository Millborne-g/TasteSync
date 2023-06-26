import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
// import Test from './pages/Test';
import Navbar from './components/Navbar'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

function App() {
  const [userID, setUserID] = useState(localStorage.getItem("jwt_autorization"));
  return (
    <div>
      {/* <Navbar /> */}
      <Routes>
        <Route index element={<Home/>}/>
        {/* <Route path='/Test' element={<Test/>}/> */}
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path={`/${userID}`} element={<Profile/>}/>
      </Routes>

    </div>
  );
}

export default App;
