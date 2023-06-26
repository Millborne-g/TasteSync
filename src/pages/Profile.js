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

import {db} from '../firebase';
import {uid} from 'uid'; 
import { onValue, ref, remove, set, update } from 'firebase/database';
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

  // useEffect(()=>{ 
  //   // const fetchDataAPI = (recipeNameDashboard,recipeIdLinkDashboard) =>{
  //   //   setListRecipe([]);
  //   //   fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${recipeNameDashboard}&app_id=e7e02e83&app_key=%20da551a9f6b2596058ec897a1dd5949ab%09`)
  //   //   .then((response) => response.json())
  //   //   .then((data) =>{
  //   //       // console.log(data.hits)
  //   //       // setListRecipe([]);
  //   //       data.hits.forEach(element => {
  //   //           // let likedRecipeIdAPI = element.recipe.uri.split('#')[1];
  //   //           if(element.recipe.uri === recipeIdLinkDashboard){
  //   //             setLabel(element.recipe.label) ;
  //   //             setMealType(element.recipe.mealType);
  //   //             setImage(element.recipe.image);
  //   //             setSource(element.recipe.source);
  //   //             setIngredientLines(element.recipe.ingredientLines);
  //   //             setUri(element.recipe.uri);
  //   //             setUrl(element.recipe.url);
  //   //             setHealthLabels(element.recipe.healthLabels);

  //   //             // const [label, setLabel] = useState('');
  //   //             // const [mealType, setMealType] = useState('');;
  //   //             // const [image, setImage] = useState('');
  //   //             // const [source, setSource] = useState('');
  //   //             // const [ingredientLines, setIngredientLines] = useState();
  //   //             // const [uri, setUri] = useState();

  //   //             // const [url, setUrl] = useState();
  //   //             // const [healthLabels, setHealthLabels] = useState();
               
  //   //             setListRecipe((oldArray) => [...oldArray, [element.recipe.label, element.recipe.mealType, element.recipe.image, element.recipe.source, element.recipe.ingredientLines, element.recipe.uri, element.recipe.url, element.recipe.healthLabels]]);
  //   //           }

  //   //       });
          
  //   //       // setListRecipe((oldArray) => [...oldArray,])
  //   //   })
  //   // }

  //   const fetchData = () =>{
  //   //   console.log('executed')
  //   //   // setListRecipe([]);
  //   //   // setListRecipe([]);
  //   //   onValue(ref(db, `userLikedRecipe/${userID}`), (snapshot) => {
  //   //     const data = snapshot.val();
  //   //     setListRecipe([]);  
  //   //     if (data !== null) {
  //   //       // setListRecipe([]);
          
  //   //       Object.values(data).map((recipeID) => {
  //   //           // ngano ga double tungod aning fetch
  //   //           fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${recipeID.recipeNameDashboard}&app_id=e7e02e83&app_key=%20da551a9f6b2596058ec897a1dd5949ab%09`)
  //   //           .then((response) => response.json())
  //   //           .then((data) =>{

  //   //             console.log(recipeID.likedRecipeId);
  //   //             console.log('---------------------------------');
  //   //               data.hits.forEach(element => {
                    
  //   //                   let likedRecipeIdAPI = element.recipe.uri.split('#')[1];
  //   //                   if(likedRecipeIdAPI === recipeID.likedRecipeId){
  //   //                     console.log(likedRecipeIdAPI+' '+ recipeID.likedRecipeId);

  //   //                   //   setLabel(element.recipe.label) ;
  //   //                   //   setMealType(element.recipe.mealType);
  //   //                   //   setImage(element.recipe.image);
  //   //                   //   setSource(element.recipe.source);
  //   //                   //   setIngredientLines(element.recipe.ingredientLines);
  //   //                   //   setUri(element.recipe.uri);
  //   //                   //   setUrl(element.recipe.url);
  //   //                   //   setHealthLabels(element.recipe.healthLabels);
        
  //   //                   //   // const [label, setLabel] = useState('');
  //   //                   //   // const [mealType, setMealType] = useState('');;
  //   //                   //   // const [image, setImage] = useState('');
  //   //                   //   // const [source, setSource] = useState('');
  //   //                   //   // const [ingredientLines, setIngredientLines] = useState();
  //   //                   //   // const [uri, setUri] = useState();
        
  //   //                   //   // const [url, setUrl] = useState();
  //   //                   //   // const [healthLabels, setHealthLabels] = useState();
                       
  //   //                   setListRecipe((oldArray) => [...oldArray, [element.recipe.label, element.recipe.mealType, element.recipe.image, element.recipe.source, element.recipe.ingredientLines, element.recipe.uri, element.recipe.url, element.recipe.healthLabels]]);
  //   //                   }
        
  //   //               });
                  
  //   //               // setListRecipe((oldArray) => [...oldArray,])
  //   //           })
  //   //         } 
  //   //       )
          
  //   //     }
  //   //   });
  //   // }

  //   // fetchData();
  //   console.log('executed')
  //   // setListRecipe([]);
  //   // setListRecipe([]);
  //   onValue(ref(db, `userLikedRecipe/${userID}`), (snapshot) => {
  //     const data = snapshot.val();
  //     if (data !== null) {
  //       // setListRecipe([]);
        
  //       Object.values(data).map((recipeID) => {
  //           // ngano ga double tungod aning fetch
  //           console.log(recipeID.likedRecipeId);
  //           fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${recipeID.recipeNameDashboard}&app_id=e7e02e83&app_key=%20da551a9f6b2596058ec897a1dd5949ab%09`)
  //           .then((response) => response.json())
  //           .then((data) =>{

  //             console.log(recipeID.likedRecipeId);
  //             console.log('---------------------------------');
  //               data.hits.forEach(element => {
                  
  //                   let likedRecipeIdAPI = element.recipe.uri.split('#')[1];
  //                   if(likedRecipeIdAPI === recipeID.likedRecipeId){
  //                     console.log(likedRecipeIdAPI+' '+ recipeID.likedRecipeId);

  //                   //   setLabel(element.recipe.label) ;
  //                   //   setMealType(element.recipe.mealType);
  //                   //   setImage(element.recipe.image);
  //                   //   setSource(element.recipe.source);
  //                   //   setIngredientLines(element.recipe.ingredientLines);
  //                   //   setUri(element.recipe.uri);
  //                   //   setUrl(element.recipe.url);
  //                   //   setHealthLabels(element.recipe.healthLabels);
      
  //                   //   // const [label, setLabel] = useState('');
  //                   //   // const [mealType, setMealType] = useState('');;
  //                   //   // const [image, setImage] = useState('');
  //                   //   // const [source, setSource] = useState('');
  //                   //   // const [ingredientLines, setIngredientLines] = useState();
  //                   //   // const [uri, setUri] = useState();
      
  //                   //   // const [url, setUrl] = useState();
  //                   //   // const [healthLabels, setHealthLabels] = useState();
                     
  //                   setListRecipe((oldArray) => [...oldArray, [element.recipe.label, element.recipe.mealType, element.recipe.image, element.recipe.source, element.recipe.ingredientLines, element.recipe.uri, element.recipe.url, element.recipe.healthLabels]]);
  //                   }
      
  //               });
                
  //               // setListRecipe((oldArray) => [...oldArray,])
  //           })
  //         } 
  //       )
        
  //     } else{
  //       console.log('walay data lugar ?')
  //     }
  //   });
  // }
    

  // },[]);


  useEffect(() =>{
    onValue(ref(db, `userLikedRecipe/${userID}`), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setListRecipe([]);
        Object.values(data).map((recipeID) => {
            // ngano ga double tungod aning fetch
            setListRecipe((oldArray) => [...oldArray, [recipeID.recipeNameDashboard, '', recipeID.recipeImageDashboard, recipeID.recipeAuthorDashboard, recipeID.recipeIngredientsDashboard, recipeID.recipeIdLinkDashboard, recipeID.recipeURLDashboard, recipeID.recipeHealthBenifitsDashboard]]);
           
          } 
        )
        
      } else{
        console.log('walay data lugar ?')
      }
    });
  },[])

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
    setClickedLikedRecipeState(true);
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
    setClickedLikedRecipeState(false);
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

    const openRecipeModal = (recipeName,recipeImage,recipeSource,recipeIngredients,recipeUri,recipeUrl,recipeHealthBenifits) =>{
      handleRecipeShow(); 
      setRecipeNameDashboard(recipeName);
      setRecipeImageDashboard(recipeImage);
      setRecipeAuthorDashboard(recipeSource);
      setRecipeIngredientsDashboard(recipeIngredients);
      setRecipeIdLinkDashboard(recipeUri);
      setRecipeURLDashboard(recipeUrl);
      setRecipeHealthBenifitsDashboard(recipeHealthBenifits)
  }
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
                  <img className='socialLinkLabelImage' src={clickedLikedRecipeState ? recipeRecommendationsFilled : recipeRecommendations } alt="" /> 
                  <span className='socialLinkLabelText recommTextActive'>Meal Journey</span> 
                </div>
              </div>
              <div className='socialLinkDivider'></div> 
              {!clickedRecipeRecomState ?
              <>
              <div className='RecipeDashboardContainer'>
                {records.map((recipe, index)=>(
                    <RecipeCard key={index}  recipeName={recipe[0]} recipeNumberIngredients={recipe[1]} recipeImage={recipe[2]} recipeSource={recipe[3]} recipeIngredients={recipe[4]} recipeUri={recipe[5]} recipeUrl={recipe[6]} recipeHealthBenifits={recipe[7]} openRecipeModal={openRecipeModal}/>
                ))}
              </div>
              {numbers.length>1? 
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
              : ''
            }
              
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
                    <Modal.Title>Create Meal Journey</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <label htmlFor="createLink" className="form-label userCreateLinkNameLabel">Title</label>
                            <input type="text" className="form-control userCreateLinkInput" id="createLink" placeholder='Title' value={recomTitle} onChange={(e)=>setRecomTitle(e.target.value)} required/>
                            <label htmlFor="createLinkImage" className="form-label userCreateLinkNameLabel">Cover Image</label>
                            <input type="file" className="form-control" id="createLinkImage" accept="image/png, image/gif, image/jpeg" onChange={(e) => handleFileChange(e)}/>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type='submit' >Save</Button>
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