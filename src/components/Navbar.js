import React, { useEffect, Dispatch, SetStateAction, useState } from 'react';
import logo from '../assets/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {db,storage} from '../firebase';
import { onValue, ref, remove, set, update } from 'firebase/database';
import Cookies from 'universal-cookie';

function Navbar() {
  const cookies = new Cookies();
  const [userID, setUserID] = useState(localStorage.getItem("jwt_autorization"));
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');

  useEffect(() =>{
    if(userID){
      onValue(ref(db, `/users/${userID}`), (snapshot) => {
          // setUserLinkList([]);
          const data = snapshot.val();
          if (data !== null) {

              let userFullName = data.name;
              let userImage = data.imageLink;

              setUserName(userFullName);
              if(!userImage){
                setUserImage('http://drive.google.com/uc?export=view&id=1KZ9F0m3bKZ2pXAvspPOLIWT7eKKj0aGM');
              } else{
                setUserImage(userImage);
              }
        }
      });
        
    }
  },[userID])

  return (
    <>
        <header>
        <nav className="navbar fixed-top navbar-expand-lg bg-body-tertiary">
            <div className="container">
                <a className="navbar-brand" href="http://localhost:3000/">
                    <img className='logoImg' src={logo} alt="" />
                    <span className='logoName'>NutriPlan</span> 
                </a>
                
                {/* <button classNameName="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    
                </button> */}
                <div className="justify-content-end" id="navbarSupportedContent">
                    <ul className="navbar-nav">
                      {userID ? 
                      <>
                        <li className="nav-item dropdown">
                          <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <img className='userImageProfileNavbar' src={userImage} alt="" />
                            <span className='userNameDashboardNavbar'>{userName}</span>
                          </a>
                          <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href={`/${userID}`}>Profile</a></li>
                            <hr className="dropdown-divider"/>
                            <li><a className="dropdown-item" onClick={() => {localStorage.setItem('userID', ''); cookies.remove('jwt_autorization'); cookies.remove('userEmail'); localStorage.removeItem('jwt_autorization'); window.open('http://localhost:3000/', '_self'); localStorage.setItem('emptyStory',[])}}>Logout</a></li>
                          </ul>
                        </li>
                      </>
                        : 
                        <>
                          <li className="nav-item navloginContiner">
                            <span className="nav-link"><a className='navlogin' href="/login">Log in</a></span>
                          </li>
                          <li className="nav-item">
                            <a type="button" className="btn btn-primary" href="/signup"><span className='navSignUp'>Sign up</span></a>
                            {/* onClick={() => {setShowNavbar(false)}} */}
                          </li>
                        </>
                      }
                          
                      
                    </ul>
                </div>
                
            </div>
        </nav>
    </header>
    </>
  )
}

export default Navbar