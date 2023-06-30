import React, {useState, useEffect} from 'react';
import heroImage from '../assets/hero-image.svg';
import heartIcon from '../assets/heart-icon.svg'
import heartIconFilled from '../assets/heart-filled-icon.svg';
import searchIcon from '../assets/search-icon.svg';
import card1 from '../assets/card-1.svg';
import card2 from '../assets/card-2.svg';

import Cookies from 'universal-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Navbar from '../components/Navbar';
import PeopleStory from '../components/PeopleStory';
import RecipeList from '../components/RecipeList';
import RecipeListCopy from '../components/RecipeListCopy';
import { Dropdown, Button, Modal  } from 'react-bootstrap';
import {db} from '../firebase';
import {uid} from 'uid'; 
import { onValue, ref, remove, set, update } from 'firebase/database';

import AOS from 'aos';
import 'aos/dist/aos.css';


function Home() {
    const cookies = new Cookies();
    const [userID, setUserID] = useState(localStorage.getItem("jwt_autorization"));
    const [searchInput, setSearchInput] = useState();
    const [recipeImageDashboard, setRecipeImageDashboard] = useState('');
    const [recipeNameDashboard, setRecipeNameDashboard] = useState('');
    const [recipeAuthorDashboard, setRecipeAuthorDashboard] = useState('');
    const [recipeIngredientsDashboard, setRecipeIngredientsDashboard] = useState([]);
    const [recipeHealthBenifitsDashboard, setRecipeHealthBenifitsDashboard] = useState([]);
    const [recipeIdLinkDashboard, setRecipeIdLinkDashboard] = useState('');
    const [recipeURLDashboard, setRecipeURLDashboard] = useState('');
    const [recipeMealType, setRecipeMealType] = useState('');
    const [showRecipeModal, setShowRecipeModal] = useState(false);
    const [clickLike, setClickLike] = useState(false);
    const [clickSearch, setClickSearch] = useState(false);

    const [getDataCounter, setGetDataCouter] = useState(0);

    useEffect(() => {
        AOS.init();
    }, [])


    useEffect(() => {
        document.title = 'TasteSync';
      }, []);

    const handleRecipeClose = () => {
        setShowRecipeModal(false);
    };
    const handleRecipeShow = () => {
        setClickLike(false);
        setShowRecipeModal(true);
    
    };

    const likeRecipe = () =>{
        // //write
        setClickLike(!clickLike);
        let likedRecipeId = recipeIdLinkDashboard.split('#')[1];
        let searchInputContent = ''
        if(searchInput === ''){
            searchInputContent='n/a'
        }
        if(!clickLike){
            set(ref(db, `userLikedRecipe/${userID}/${likedRecipeId}`), {
                likedRecipeId,
                recipeNameDashboard,
                recipeIdLinkDashboard,
                searchInput : searchInputContent,
                recipeImageDashboard,
                recipeNameDashboard,
                recipeAuthorDashboard,
                recipeIngredientsDashboard,
                recipeHealthBenifitsDashboard,
                recipeURLDashboard,

            });
        } else{
            remove(ref(db, `userLikedRecipe/${userID}/${likedRecipeId}`));
        }
        

    }
    useEffect(()=>{
        if(recipeIdLinkDashboard){
            // console.log(recipeIdLinkDashboard)
            let likedRecipeId = recipeIdLinkDashboard.split('#')[1];
            onValue(ref(db, `userLikedRecipe/${userID}/${likedRecipeId}`), (snapshot) => {
            
            const data = snapshot.val();
            if (data !== null) {
                setClickLike(true);
            } else{
                setClickLike(false);
            }
            });
        }
    },[recipeIdLinkDashboard]);
    
  return (
    <>
    <Navbar/>
    {userID ? 
    <section className='dashboard'>
        <div className='dashboard-inner container'>
            <div className="navbarMealPlanDashboard">
                <div className='headerMealPlanDashboard-inner'>
                    <span className='headerMealPlanRecipe'>Discover People's <span className='highlightMealPlanRecipe'>Favorites</span></span>
                </div>
            </div>
            <PeopleStory />
            <div className="navbarRecipesDashboard">
                <div className='navbarRecipesDashboard-inner'>
                    <span className='headerMealPlanRecipe' id='headerMealPlanRecipe'>Explore new <span className='highlightMealPlanRecipe'>Recipes</span></span>
                    
                    <div className='searchBarDashboard'>
                        <form className='searhbarForm' onSubmit={(e)=>{e.preventDefault(); setClickSearch(true)}}>
                            <input type="text" className="form-control searhInput" placeholder="Search" aria-label="Recipient's username" aria-describedby="basic-addon2" value={searchInput} onChange={(e) =>{setSearchInput(e.target.value)}}/>
                            <button className="btn searhBtn" type="submit"><img src={searchIcon}/></button>
                            <div className="btnDividerContainer">
                                <div className="btnDivider"></div>
                            </div>
                        </form>
                        
                    </div>
                    
                </div>
            </div>
            <RecipeList searchInput={searchInput} setRecipeNameDashboard={setRecipeNameDashboard} handleRecipeShow={handleRecipeShow} setRecipeImageDashboard={setRecipeImageDashboard} setRecipeAuthorDashboard={setRecipeAuthorDashboard} setRecipeIngredientsDashboard={setRecipeIngredientsDashboard} setRecipeIdLinkDashboard={setRecipeIdLinkDashboard} setRecipeURLDashboard={setRecipeURLDashboard} setRecipeHealthBenifitsDashboard={setRecipeHealthBenifitsDashboard} clickSearch={clickSearch} setClickSearch={setClickSearch}/>
            {/* <RecipeListCopy/> */}
        </div>
        <Modal show={showRecipeModal} onHide={handleRecipeClose} centered>
            <Modal.Header closeButton>
            <Modal.Title>Recipe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='recipeImageDashboardContainer'>
                    <img className='recipeImageDashboard' src={recipeImageDashboard}/>
                    <div className='likeRecipeBtnContainer' onClick={()=>likeRecipe()}>
                        <div className='likeRecipeBtn'>
                            {clickLike ? 
                            <img src={heartIconFilled}/>
                            :
                            <img src={heartIcon}/>
                            }
                            
                        </div>
                    </div>
                </div>
                

                <div className='recipeHeaderDashboard'>
                    <span className='recipeName'> {recipeNameDashboard}</span>
                    <span>by {recipeAuthorDashboard}</span>
                </div>
                <div className='recipeIngredientsDashboard'>
                    <span className='recipeName'>Ingredients:</span>
                    <br />
                    {recipeIngredientsDashboard.map((element, index)=>(
                        <div key={index}>
                            <span className='ingredientList'>• {element}</span> <br />
                        </div>
                    ))}
                </div>

                <div className='recipeIngredientsDashboard'>
                    <span className='recipeName'>Dietary Labels and Restrictions:</span>
                    <br />
                    {recipeHealthBenifitsDashboard.map((element, index)=>(
                        <div key={index}>
                            <span className='ingredientList'>• {element}</span> <br />
                        </div>
                    ))}

                </div>
                <div className='viewMoreContainer'>
                    <a className='viewMore' href={recipeURLDashboard} target='_blank'>View More</a>
                </div>
                
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleRecipeClose}>
                Close
            </Button>
            {/* <Button variant="primary" type='submit' onClick={()=>submit_Link_to_DB()}>Save</Button> */}
            </Modal.Footer>
        </Modal>
        
    </section>
    :
     <section className='hero'>
        <div className="container hero-inner">
            <div className="row headline-inner-row">
                <div className="col heroHeadlines">
                    <div className="heroHeadlinesInner">
                        <span className='headline' data-aos="fade-right" data-aos-delay="1000" >Elevate Your Meals with Inspiring <span className='headlineHighlight'>Recipes</span> </span>
                        <span className='subHeadline' data-aos="fade-right" data-aos-delay="1300">Explore new tastes, collect beloved recipes, and share them within the community.</span>
                        <div className='buttonContainer'>
                        <a className="getStartedBtn" href='./signup' data-aos="fade-right" data-aos-delay="1600">Get Started</a>
                            <div>
                                {/* <form className="input-group mb-3 buttonContainer-inner" onSubmit={(e) => {e.preventDefault(); setEmailAdd(emailAdd); window.location.href = '/signup'; }}>
                                    <input type="text" className="form-control emailInput" placeholder="Enter your email..." aria-label="Recipient's username" aria-describedby="button-addon2" value={emailAdd} onChange={(e) => setEmailAdd(e.target.value)}/>
                                    <Link className="emailInputBtn" href="/signup"><span> Sign up <FontAwesomeIcon className='arrowIcon' icon={faArrowRight} /></span></Link>
                                </form> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col heroImageContainer" >
                    <div className="heroImageContainerInner" data-aos-delay="1900">
                        <img className='heroImage' src={heroImage} />
                        <img className='card1' data-aos="fade-up" data-aos-delay="2300" src={card1}/>
                        <img className='card2' data-aos="fade-up" data-aos-delay="2600" src={card2}/>
                    </div>
                </div>
            </div>

        </div>

        <div className='footer'>
            <span> © 2023 TasteSync | <a className='portfolioLink' href="https://millborneportfolio.vercel.app/" target="_blank">Millborne Galamiton.</a> All rights reserved.</span>
        </div>
    </section>
    
    }
 
      
    </>
  )
}

export default Home