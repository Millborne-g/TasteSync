import React, {useState, useEffect} from 'react';
import Navbar from '../components/Navbar';
import Recipe from '../components/RecipeList';
import RecipeCard from '../components/RecipeCard';
import heartIconBlue from '../assets/heart-filled-icon-blue.svg';
import heartIcon from '../assets/heart-icon.svg'
import heartIconFilled from '../assets/heart-filled-icon.svg';
import recipeRecommendations from '../assets/recipe-recommendations.svg';
import recipeRecommendationsFilled from '../assets/recipe-recommendations-filled.svg';
import Loader from '../components/Loader'

import {db,storage} from '../firebase';
import {uid} from 'uid'; 
import { onValue, ref, remove, set, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, StorageReference } from "firebase/storage";
import { Dropdown, Button, Modal  } from 'react-bootstrap';

function Profile() {
  const [userID, setUserID] = useState(localStorage.getItem("jwt_autorization"));
  const [listRecipe, setListRecipe] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 12;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = listRecipe.slice(firstIndex, lastIndex);
  const npage = Math.ceil(listRecipe.length/recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1)

  const [label, setLabel] = useState('');
  const [mealType, setMealType] = useState('');;
  const [image, setImage] = useState('');
  const [source, setSource] = useState('');
  const [ingredientLines, setIngredientLines] = useState();
  const [uri, setUri] = useState();
  const [url, setUrl] = useState();
  const [healthLabels, setHealthLabels] = useState();

  const [clickedRecipeRecomState, setClickedRecipeRecomState] = useState(false);
  const [clickedLikedRecipeState, setClickedLikedRecipeState] = useState(false);

  const [recipeImageDashboard, setRecipeImageDashboard] = useState('');
  const [recipeNameDashboard, setRecipeNameDashboard] = useState('');
  const [recipeAuthorDashboard, setRecipeAuthorDashboard] = useState('');
  const [recipeIngredientsDashboard, setRecipeIngredientsDashboard] = useState([]);
  const [recipeHealthBenifitsDashboard, setRecipeHealthBenifitsDashboard] = useState([]);
  const [recipeIdLinkDashboard, setRecipeIdLinkDashboard] = useState('');
  const [recipeURLDashboard, setRecipeURLDashboard] = useState('');
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [clickLike, setClickLike] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [recomTitle, setRecomTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState(null);;
  const [imageLinkURL, setImageLinkURL] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  const handleRecipeClose = () => {
    setShowRecipeModal(false);
  };
  const handleRecipeShow = () => {
      setClickLike(true);
      setShowRecipeModal(true);
  };

  const handleClose = () => {
    setShowCreateModal(false);
    setRecomTitle('');
  };
  const handleShow = () => setShowCreateModal(true);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const likeRecipe = () =>{
    // //write
    setClickLike(!clickLike);
    let likedRecipeId = recipeIdLinkDashboard.split('#')[1];
    if(!clickLike){
        set(ref(db, `userLikedRecipe/${userID}/${likedRecipeId}`), {
            likedRecipeId,
            recipeNameDashboard,
            recipeIdLinkDashboard
        });
        setShowRecipeModal(false);
        setListRecipe([]);
        window.open(`http://localhost:3000/${userID}`, '_self');
    } else{
        remove(ref(db, `userLikedRecipe/${userID}/${likedRecipeId}`));
        setShowRecipeModal(false);
        setListRecipe([]);
        window.open(`http://localhost:3000/${userID}`, '_self');
    }
    

}

const submit_recom_to_DB = () =>{
  setShowLoader(true);
  setShowCreateModal(false)
   if (selectedFile) {
       const test = 'test';
       // const storageRefImage = storageRef(storage);
       
       const fileRef = storageRef(storage, selectedFile.name);

       uploadBytes(fileRef, selectedFile)
           .then((snapshot) => getDownloadURL(snapshot.ref))
           .then((url) => {
               setImageLinkURL(url);
           })
           .catch((error) => {
               console.error('Error uploading image:', error);
           });
   } else{
       setImageLinkURL('http://drive.google.com/uc?export=view&id=1ByrmsfllxPY095bp3B2XULp1rXvaed27');
   }

   // alert('Saved to Database');
}

useEffect(() => {
  const fetchDataAPI = (recipeNameDashboard, recipeIdLinkDashboard) => {
    fetch(
      `https://api.edamam.com/api/recipes/v2?type=public&q=${recipeNameDashboard}&app_id=e7e02e83&app_key=%20da551a9f6b2596058ec897a1dd5949ab%09`
    )
      .then((response) => response.json())
      .then((data) => {
        // const recipe = data.hits.find((element) => element.recipe.uri === recipeIdLinkDashboard)?.recipe;
        // if (recipe) {
        //   setListRecipe((oldArray) => [
        //     ...oldArray,
        //     {
        //       name: recipe.label,
        //       numberIngredients: recipe.ingredientLines.length,
        //       image: recipe.image,
        //       source: recipe.source,
        //       ingredients: recipe.ingredientLines,
        //       uri: recipe.uri,
        //       url: recipe.url,
        //       healthBenefits: recipe.healthLabels,
        //     },
        //   ]);
          // setListRecipe(recipe);
        // }
        if (data.hits) {
          
          const recipes = data.hits.map((element) => ({
            name: element.recipe.label,
            numberIngredients: element.recipe.ingredientLines.length,
            image: element.recipe.image,
            source: element.recipe.source,
            ingredients: element.recipe.ingredientLines,
            uri: element.recipe.uri,
            url: element.recipe.url,
            healthBenefits: element.recipe.healthLabels,
          }));
          console.log(recipes[0])
          setListRecipe(recipes);
        }
      });
  };

  const fetchData = () => {
    onValue(ref(db, `userLikedRecipe/${userID}`), (snapshot) => {
      const data = snapshot.val();
      setListRecipe([]);
      if (data !== null) {
        Object.values(data).forEach((recipeID) => {
          fetchDataAPI(recipeID.recipeNameDashboard, recipeID.recipeIdLinkDashboard);
        });
      }
    });
  };

  fetchData();

  // Cleanup function to remove event listeners and reset state
  return () => {
    // Remove any event listeners or subscriptions if necessary
    setListRecipe([]);
  };
}, [userID]);

  const clickRecipeRecommendations = () =>{
    let likedInnerActive = document.querySelector('.likedInnerActive');
    let likedTextActive = document.querySelector('.likedTextActive');
    let recommInnerActive = document.querySelector('.recommInnerActive');
    let recommTextActive = document.querySelector('.recommTextActive');
    likedInnerActive.classList.remove('active');
    likedTextActive.classList.remove('active');
    recommInnerActive.classList.add('active');
    recommTextActive.classList.add('active');
    setClickedRecipeRecomState(true);
    setClickedLikedRecipeState(false);
  }

  const clickLikedRecipe = () =>{
    let recommInnerActive = document.querySelector('.recommInnerActive');
    let recommTextActive = document.querySelector('.recommTextActive');
    let likedInnerActive = document.querySelector('.likedInnerActive');
    let likedTextActive = document.querySelector('.likedTextActive');
    recommInnerActive.classList.remove('active');
    recommTextActive.classList.remove('active');
    likedInnerActive.classList.add('active');
    likedTextActive.classList.add('active');
    setClickedLikedRecipeState(true);
    setClickedRecipeRecomState(false);
  }

  const prePage = () =>{
    if(currentPage !== 1){
        setCurrentPage(currentPage-1);
      }
    }

    const changeCpage = (id) =>{
        setCurrentPage(id);
    }

    const nextPage = () =>{
        if(currentPage !== npage){
            setCurrentPage(currentPage+1);
        }
    }

    const openRecipeModal = (recipe) => {
      handleRecipeShow();
      setRecipeNameDashboard(recipe.name);
      setRecipeImageDashboard(recipe.image);
      setRecipeAuthorDashboard(recipe.source);
      setRecipeIngredientsDashboard(recipe.ingredients);
      setRecipeIdLinkDashboard(recipe.uri);
      setRecipeURLDashboard(recipe.url);
      setRecipeHealthBenifitsDashboard(recipe.healthBenefits);

    };
  return (
    <>
      <Navbar/>
      <section className='dashboard'>
        <div className='dashboard-inner container'>
          <div className="navbarMealPlanDashboard">
                <div className='headerMealPlanDashboard-inner'>
                    <span className='headerMealPlanRecipe'>Activity <span className='highlightMealPlanRecipe'>Timeline</span></span>
                </div>
            </div>
            
              <div className="socialLinkLabel">
                <div className="socialLinkLabel-inner likedInnerActive active" onClick={()=>{clickLikedRecipe()}}>
                  <img className='socialLinkLabelImage' src={clickedRecipeRecomState ? heartIcon : heartIconBlue} alt="" /> 
                  <span className='socialLinkLabelText likedTextActive active'>Liked Recipe</span> 
                </div>
                <div className="socialLinkLabel-inner recommInnerActive" onClick={()=>{clickRecipeRecommendations()}}>
                  <img className='socialLinkLabelImage' src={clickedLikedRecipeState ? recipeRecommendations : recipeRecommendationsFilled} alt="" /> 
                  <span className='socialLinkLabelText recommTextActive'>Recipe Recommendations</span> 
                </div>
              </div>
              <div className='socialLinkDivider'></div> 
              {!clickedRecipeRecomState ?
              <>
              <div className='RecipeDashboardContainer'>
                {listRecipe.map((recipe, index) => (
                  <RecipeCard
                    key={index}
                    recipe={recipe}
                    openRecipeModal={openRecipeModal}
                  />
                ))}
              </div>
              <div className='paginationContainer'>
                <ul className='pagination'>
                    <li className='page-item'>
                        <a href='#' className='page-link' onClick={()=>prePage()}>prev</a>
                    </li>
                    {
                        numbers.map((n,i)=>(
                            <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={i}>
                                <a href='#' className='page-link' onClick={()=>changeCpage(n)}>{n}</a>
                            </li>
                        ))
                    }

                    <li className='page-item'>
                        <a href='#' className='page-link' onClick={()=>nextPage()}>Next</a>
                    </li>

                </ul>

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
              </> : 
              <>
                <div className="totalCreateContainer">
                    <div className="totalCreateContainer-inner">
                        <button type="button" className="btn btn-primary createLinkBtn" onClick={handleShow}> <span>+ Create</span> </button>
                    </div>
                </div>
                <Modal show={showCreateModal} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Create Recipe Recommendations</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <label htmlFor="createLink" className="form-label userCreateLinkNameLabel">Title</label>
                            <input type="text" className="form-control userCreateLinkInput" id="createLink" placeholder='Link name' value={recomTitle} onChange={(e)=>setRecomTitle(e.target.value)} required/>
                            <label htmlFor="createLinkImage" className="form-label userCreateLinkNameLabel">Cover Image</label>
                            <input type="file" className="form-control" id="createLinkImage" accept="image/png, image/gif, image/jpeg" onChange={(e) => handleFileChange(e)}/>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type='submit'onClick={()=>submit_recom_to_DB()}>Save</Button>
                    </Modal.Footer>
                </Modal>
              </>
              }

        </div>

        
      </section>
    </>
  )
}

export default Profile