import logo from './logo.svg';
import './App.css';

import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
// import Test from './pages/Test';
import Navbar from './components/Navbar'
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <div>
      {/* <Navbar /> */}
      <Routes>
        <Route index element={<Home/>}/>
        {/* <Route path='/Test' element={<Test/>}/> */}
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>

    </div>
  );
}

export default App;
