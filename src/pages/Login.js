import React, {useState, useEffect} from 'react';
import logo from '../assets/login-logo.svg';
import googleIcon from '../assets/google-icon.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useGoogleLogin, GoogleLogin, googleLogout } from '@react-oauth/google';
import {db} from '../firebase';
import { onValue, ref, remove, set, update } from 'firebase/database';
import { uid } from 'uid';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../components/Loader';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';

function Login() {
    const cookies = new Cookies();
    const [userID, setUserID] = useState(localStorage.getItem("jwt_autorization"));
    const [email, setEmail] = useState('');
    const [clickSignIn, setClickSignIn] = useState(false);
    const [password, setPassword] = useState('');
    const [signInLoader, setSignInLoader] = useState(false);
    const inputEmailElement = typeof document !== 'undefined' ? document.querySelector('.inputUserEmail'): null;
    const inputPasswordElement = typeof document !== 'undefined' ? document.querySelector('.inputUserPassword'): null;
    const [showToast, setShowToast] = useState(false);
    const [toastText,setToastText] = useState('');
    const [clickLogInGoogle, setClickLogInGoogle] = useState(false);

    useEffect(() => {
        document.title = 'TasteSync | Log in';
      }, []);

    useEffect(()=>{
        if(userID){
          window.open('http://localhost:3000/', '_self');
        }
    },[userID])

    const customId = "custom-id-notify";

    const notify = () => toast.error(toastText, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      toastId: customId
    });

    useEffect(() => {
        if (showToast) {
          notify();
          setClickSignIn(false);
        }
    }, [clickSignIn, toastText]);

    const login = (e) =>{
        e.preventDefault();
        setSignInLoader(true);
        setClickSignIn(true);
        
        let idTemp= '';
        if(email !== '' && password !== ''){
            onValue(ref(db, `/users`), (snapshot) => {
                const data = snapshot.val();
                let foundEmail = false;
                let foundPassword = false;
                if (data !== null) {
                  Object.values(data).map((user) => {
                    
                    let userEmail = user.email;
                    let userPassword = user.password;
                    let userIDDB = user.ID;
                    if (userEmail === email){
                        foundEmail = true;
                        idTemp = userIDDB ?? "";
                        if(userPassword === password){
                            foundPassword = true;
                        }
                     }
                  });
                }

                if(foundEmail === false){
                    setSignInLoader(false);
                    idTemp = '';
                    inputEmailElement?.classList.add('is-invalid');
                    setShowToast(true);
                    setToastText("Email don't exist.")
                } 
                else if(foundPassword === false){
                    idTemp = '';
                    setSignInLoader(false);
                    inputPasswordElement?.classList.add('is-invalid');
                    setShowToast(true);
                    setToastText("Incorrect Password.");
                }
                else if(foundEmail===true && foundPassword===true){
                    setSignInLoader(true);
                    setTimeout(() => {
                        setSignInLoader(false);
                        cookies.set("jwt_autorization",idTemp);
                        cookies.set("userEmail",email);
                        localStorage.setItem("jwt_autorization",idTemp);
                        window.open('http://localhost:3000/', '_self');
                        
                    },3000);
                } 
                else{
                    setSignInLoader(false);
                }
            });  
        } 
        else{
            setSignInLoader(false);
        }
    }

    const logInWithGoogleNextPage = () =>{
        setSignInLoader(true);
        setClickSignIn(true);
        let idTemp = '';
        if(email !== ''){
            onValue(ref(db, `/users`), (snapshot) => {
                const data = snapshot.val();
                let foundEmail = false;
                let foundPassword = false;
                if (data !== null) {
                  Object.values(data).map((user) => {
                    let userEmail = user.email;
                    let userPassword = user.password;
                    let userIDDB = user.ID;
                    if (userEmail === email){
                        foundEmail = true;
                        idTemp = userIDDB;
                        if(userPassword === password){
                            foundPassword = true;
                        }
                     }
                  });
                }

                if(foundEmail === false){
                    setSignInLoader(false);
                    idTemp = '';
                    inputEmailElement?.classList.add('is-invalid');
                    setShowToast(true);
                    setToastText("Email don't exist.");
                    setTimeout(() =>{
                        window.open('http://localhost:3000/login', '_self');
                    },3000)
                    
                } 
                else if(foundPassword === false){
                    idTemp = '';
                    setSignInLoader(false);
                    inputPasswordElement?.classList.add('is-invalid');
                    setShowToast(true);
                    setToastText("Incorrect Password.");
                    // setTimeout(() =>{
                    //     signOut();
                    // },3000)
                }
                else if(foundEmail && foundPassword){
                    setSignInLoader(true);
                    setTimeout(() => {
                        cookies.set("jwt_autorization",idTemp);
                        cookies.set("userEmail",email);
                        localStorage.setItem("jwt_autorization",idTemp)
                        // window.location.href = 'http://localhost:3000/';
                        window.open('http://localhost:3000/', '_self');
                        // setSignInLoader(false);
                        
                    },3000);
                } 
                else{
                    setSignInLoader(false);
                }
            });  
        } 
        else{
            setSignInLoader(false);
        }
    }

    useEffect(() =>{
        if(clickLogInGoogle){
        logInWithGoogleNextPage()
        }
  
      },[clickLogInGoogle])

    const getInfoGoogle = useGoogleLogin({
        onSuccess: codeResponse => {
          const apiUrl = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${codeResponse.access_token}`;
          fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
              // setSignUpLoader(true);
            //   console.log(data); // Access the response data here
              
              setEmail(data.email);
            //   cookies.set("jwt_autorization",apiUrl);
            //   cookies.set("userEmail",data.email);
              // console.log(cookies.get('userEmail'));
              setClickLogInGoogle(true)
            })
            .catch(error => {
              console.error('Error:', error);
            });
        },
        // flow: 'auth-code',
      });

    const logInWithGoogle = () =>{
        setEmail('');
        setPassword('');
        getInfoGoogle();
    }
  return (
    <>  
        <header>
            {/* <div className="container navbarLogin">
                <a className="justify-content-start" href="#">
                    <img className='logoImg' src={logo.src} alt="" />
                </a>
            </div> */}
            <nav className="navbarLogin">
                <div className="container">
                    <a className="navbar-brand" href="http://localhost:3000/">
                        <img className='logoImg' src={logo} alt="" />
                        {/* <span className='logoName'>SocialHub</span>  */}
                    </a>
                </div>
            </nav>
        </header>

        <div className='loginCointainer container'>
            <div className="card logInCard">
                <div className="card-body">
                    <div className="login-container">
                        <span className='loginContainerText'>Welcome to TasteSync</span>
                    </div>
                    <form onSubmit={(e)=>{login(e)}}>
                        <div className="form-group textFields">
                            <label htmlFor="inputEmail" className='logInLabel'>Email address</label>
                            <input type="email" className="form-control inputUserEmail" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" value={email} onChange={(e)=>{setEmail(e.target.value); inputEmailElement?.classList.remove('is-invalid'); setShowToast(false);}} required/>
                            
                        </div>
                        <div className="form-group textFields">
                            <label htmlFor="inputPassword" className='logInLabel'>Password</label>
                            <input type="password" className="form-control inputUserPassword" id="inputPassword" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value); inputPasswordElement?.classList.remove('is-invalid'); setShowToast(false);}} required/>
                        </div>
                        <button type="submit" className="btn btn-primary logInPageBtn">Log in</button>
                        <button type="button" className="btn btn-outline-secondary logInPageBtn googleLogInPageBtn" onClick={() => logInWithGoogle()}> <img className='googleIcon' src={googleIcon} /> <span className='google'>Continue with Google</span></button>
                        

                        <div className='dontHaveAnAccount-container'>
                            <span className='dontHaveAnAccount-text'>Don't have an account ?</span>
                            <a className='dontHaveAnAccount-logIntext' href='./signup'>Sign up</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        { showToast &&
            <ToastContainer/>
        }

        {signInLoader &&
            <Loader/>
        }
    
    </>
  )
}

export default Login