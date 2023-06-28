import React, {useState, useEffect} from 'react';
import logo from '../assets/login-logo.svg';
import googleIcon from '../assets/google-icon.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { GoogleLogin } from 'react-google-login';
import { useGoogleLogin, GoogleLogin, googleLogout } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import {db} from '../firebase';
import { onValue, ref, remove, set, update } from 'firebase/database';
import { uid } from 'uid';
import Cookies from 'universal-cookie';
import Loader from '../components/Loader';

function Signup() {
    const cookies = new Cookies();
    // const [userID, setUserID] = useState('');
    const [userID, setUserID] = useState(localStorage.getItem("jwt_autorization"));
    const [email, setEmail] = useState(''); 
    const inputUserEmailElement = typeof document !== 'undefined' ? document.querySelector('.inputUserEmail') : null;
    const [name, setName] = useState("");
    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [imageLink, setImageLink] = useState('');

    const confirmPasswordElement = typeof document !== 'undefined' ? document.querySelector('.confirm-password') : null;
    const [toastConfirmPassword, setToastConfirmPassword] = useState(false);
    const [passwordDontMatch, setPasswordDontMatch] = useState(false);

    const [signUpGoogle, setSignUpGoogle] = useState(false);
    const [clickSignUpGoogle, setClickSignUpGoogle] = useState(false);

    const [toastText,setToastText] = useState('');
    const [clickSignUp, setClickSignUp] = useState(false);
    const [signUpLoader, setSignUpLoader] = useState(false);

    useEffect(() => {
      document.title = 'TasteSync | Sign up';
    }, []);

    const customId = "custom-id-password";
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

    useEffect(()=>{
      if(userID){
        window.open('https://tastesync.vercel.app/', '_self');
      }
    },[userID])

    useEffect(() => {
      if (toastConfirmPassword && !signUpGoogle) {
        notify();
        setClickSignUp(false);
      }
    }, [toastConfirmPassword, clickSignUp, toastText]);

    useEffect(() =>{
      setName(fName+' '+lName);
    },[fName, lName]);

    const submit_to_DB = () =>{
      const test = 'test';
      const uuid = uid();
      let idTemp = '';
      let emailExist = false;
      // console.log('fullname '+ name);
      let nameSplit = name.split(' ')[0];
      if (email !== ''){
        // loadDB
        onValue(ref(db, `/users`), (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            
            Object.values(data).map((user) => {
              setSignUpLoader(true);
              let userEmail = user.email;
              if (userEmail === email){
                emailExist=true;
                setSignUpGoogle(false);
                
              }
            });
          }
          if(emailExist === false){
            setSignUpLoader(true);
            setTimeout(() => {
              console.log('saving '+emailExist);
              
              set(ref(db, `/users/${uuid+nameSplit}`), {
                imageLink, //http://drive.google.com/uc?export=view&id=1KZ9F0m3bKZ2pXAvspPOLIWT7eKKj0aGM
                email,
                name,
                password,
                ID: uuid+nameSplit
              });
              cookies.set("jwt_autorization",uuid+nameSplit);
              cookies.set("userEmail",email);
              localStorage.setItem("jwt_autorization",uuid+nameSplit);
              // sessionStorage.setItem('signedOut', 'false');
              setSignUpLoader(false);
              // setSignUpSuccessfulModal(true);
              setToastConfirmPassword(false);
              // localStorage.setItem('userID', uuid+nameSplit);
              setUserID(cookies.get('userEmail'));
              
            }, 3000);
            
            // 
            
          } else{
            inputUserEmailElement?.classList.add('is-invalid');
            setSignUpLoader(false);
            setToastText("Email already exist!");
            
            setToastConfirmPassword(true);
            // console.log(clickSignUp+' '+toastText)
          }
        });  
      }
      
  }

    const signUp = (e) => {
      e.preventDefault();
      setClickSignUp(true);
      if( fName !=='' && lName !=='' && password !=='' && confirmPassword !==''){
        if (password === confirmPassword){
          setToastConfirmPassword(false);
          setSignUpLoader(true);
          submit_to_DB();
        }
        else{
          // setToastText('Passwords do not match');
          confirmPasswordElement?.classList.add('is-invalid');
          // alert('Password Don`t Match');
          setToastText("Passwords don't match.")
          setConfirmPassword('');
          // setPasswordDontMatch(true)
          setToastConfirmPassword(true)
        }
      } else {
        setPasswordDontMatch(false)
        // setToastConfirmPassword(false)
      }
      
    }

    const submit_to_DB_Google = () => {
      const test = 'test';
      const uuid = uid();
      let idTemp = '';
      let emailExist = false;
      // if(fName !== '' && lName !== ''){
      //   setName(fName+' '+lName);
      // }
      // setName(fName+' '+lName);
      // console.log('fullname '+ name);
      let nameSplit = name.split(' ')[0];
      if (email !== ''){
        // loadDB
        onValue(ref(db, `/users`), (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            
            Object.values(data).map((user) => {
              setSignUpLoader(true);
              let userEmail = user.email;
              if (userEmail === email){
                emailExist=true;
                idTemp = user.ID;
                setSignUpGoogle(false);
                
              }
            });
          }
          if(emailExist === false){
            setSignUpLoader(true);
            
            setTimeout(() => {
              
              
              set(ref(db, `/users/${uuid+nameSplit}`), {
                imageLink,
                email,
                name,
                password,
                ID: uuid+nameSplit
              });
              // sessionStorage.setItem('signedOut', 'false');
              setSignUpLoader(false);
              // alert('Saved to Database');
              // setSignUpSuccessfulModal(true);
              setToastConfirmPassword(false);
              // localStorage.setItem('userID', uuid+nameSplit);
              cookies.set("jwt_autorization",uuid+nameSplit);
              cookies.set("userEmail",email);
              localStorage.setItem("jwt_autorization",uuid+nameSplit);
              setUserID(cookies.get('userEmail'));
              
            }, 3000);
            
            // 
            
          } else{

            setTimeout(() =>{
              setSignUpLoader(true);
              cookies.set("jwt_autorization",idTemp);
              cookies.set("userEmail",email);
              localStorage.setItem("jwt_autorization",idTemp);
              setUserID(cookies.get('userEmail'));
            }, 3000)
          }
        });  
      }
    }

    useEffect(() =>{
      if(clickSignUpGoogle){
        submit_to_DB_Google()
      }

    },[clickSignUpGoogle])

    const signUpWithGoogle = useGoogleLogin({
      onSuccess: codeResponse => {
        const apiUrl = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${codeResponse.access_token}`;
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            // setSignUpLoader(true);
            // console.log(data); // Access the response data here
            
            setEmail(data.email);
            setName(data.name);
            setImageLink(data.picture)
            // cookies.set("jwt_autorization",apiUrl);
            // cookies.set("userEmail",data.email);
            // console.log(cookies.get('userEmail'));
            setClickSignUpGoogle(true)
          })
          .catch(error => {
            console.error('Error:', error);
          });
      },
      // flow: 'auth-code',
    });
    
  return (
    <>
        <div className='signUpContainer container'>
        <div className="signUpContainer-inner">
        

          <div className='logoSignup-container'>
            <img className='logo-signup' src={logo} />
          </div>
          
          <div className="createAnAccount-container">
            <span className='createAnAccount'>Create an account for free</span>
          </div>

          <form onSubmit={(e) =>{signUp(e)}}>
            <div className="row">
              <div className="col-6 textFieldsSignUp">
                <label htmlFor="firstName" className='signUpLabel'>First name</label>
                <input type="text" className="form-control" id="firstName" placeholder="First name" value={fName} onChange={(e) => setFName(e.target.value)} required />
              </div>
              <div className="col-6 textFieldsSignUp">
                <label htmlFor="lastName" className='signUpLabel'>Last name</label>
                <input type="text" className="form-control" id="lastName" placeholder="Last name" value={lName} onChange={(e) => setLName(e.target.value)} required />
              </div>
            </div>
            <div className="form-group textFieldsSignUp">
              <label htmlFor="inputEmail" className='signUpLabel'>Email address</label>
              <input type="email" className="form-control inputUserEmail" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" value={email} onChange={(e) => {setEmail(e.target.value); inputUserEmailElement?.classList.remove('is-invalid'); setToastConfirmPassword(false) }} required/>
            
            </div>
            <div className="form-group textFieldsSignUp">
              <label htmlFor="inputPassword" className='signUpLabel'>Password</label>
              <input type="password" className="form-control" id="inputPassword" placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}} required/>
            </div>

            <div className="form-group textFieldsSignUp">
              <label htmlFor="inputConfirmPassword" className='signUpLabel'>Confirm Password</label>
              <input type="password" className="form-control confirm-password" id="inputConfirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value); confirmPasswordElement?.classList.remove('is-invalid'); setToastConfirmPassword(false);setPasswordDontMatch(false); }} required/>
            </div>
            
            <button type="submit" className="btn btn-primary signUpPageBtn">Sign up</button>
            <button type="button" className="btn btn-outline-secondary signUpPageBtn googleSignUpPageBtn" onClick={() => signUpWithGoogle()}> <img className='googleIcon' src={googleIcon}/> <span className='google'>Continue with Google</span></button>
            {/* <GoogleLogin
              onSuccess={credentialResponse => {
                console.log(credentialResponse);
                
                var decoded = jwt_decode(credentialResponse.credential);
                // console.log(decoded)
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            /> */}
            { toastConfirmPassword &&
                // <ToastContainer containerId={customIdPassword} />
                <ToastContainer/>
            }   
            
            
          </form>

          <div className='alreadyHaveAnAccount-container'>
            <span className='alreadyHaveAnAccount-text'>Already have an account ?</span>
            <a className='alreadyHaveAnAccount-logIntext' href='./login'>Log in</a>
          </div>

        </div>


        
      
      </div>

      { toastConfirmPassword &&
          // <ToastContainer containerId={customIdPassword} />
          <ToastContainer/>
      }

      {signUpLoader &&
        <Loader/>
      }

    </>
  )
}

export default Signup