import React, {useState, useEffect} from 'react';
import Navbar from '../components/Navbar';
import Recipe from '../components/RecipeList';
import RecipeCard from '../components/RecipeCard';
import heartIconBlue from '../assets/heart-filled-icon-blue.svg';
import heartIcon from '../assets/heart-icon.svg'
import heartIconFilled from '../assets/heart-filled-icon.svg';
import recipeRecommendations from '../assets/recipe-recommendations.svg';
import recipeRecommendationsFilled from '../assets/recipe-recommendations-filled.svg';
import Loader from '../components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {db, storage} from '../firebase';
import {uid} from 'uid'; 
import { onValue, ref, remove, set, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, StorageReference } from "firebase/storage";
import { Dropdown, Button, Modal  } from 'react-bootstrap';

function Profile() {
  const [userID, setUserID] = useState(localStorage.getItem("jwt_autorization"));
  const [listRecipe, setListRecipe] = useState([]);

  const [showToast, setShowToast] = useState(false);
  const [toastText,setToastText] = useState('');

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
  const [caption, setCaption] = useState('')
  const [selectedFile, setSelectedFile] = useState(null);;
  const [imageLinkURL, setImageLinkURL] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  const customId = "custom-id-notify";

  const notify = () => toast.success(toastText, {
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
    }
  }, [toastText]);

  const handleRecipeClose = () => {
    setShowRecipeModal(false);
  };

  const handleRecipeShow = () => {
      setClickLike(true);
      setShowRecipeModal(true);
  };

  const handleClose = () => {
    setShowCreateModal(false);
    setCaption('');
  };
  const handleShow = () => setShowCreateModal(true);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  useEffect(()=>{
    const uuid = uid();
    const currentDate = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    // title date and time
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    // end title date and time
  
    const formattedTitleDateTime = `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);

    // Add 24 hours to the current date
    const nextDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const formattedNextDate = new Intl.DateTimeFormat('en-US', options).format(nextDate);

    if(imageLinkURL){
      let recipes;
      onValue(ref(db, `userLikedRecipe/${userID}`), (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          recipes=data
        }
      })
        set(ref(db, `/userStory/${formattedTitleDateTime}_${uuid}`), {
            caption,
            imageLinkURL,
            formattedDate,
            uuid,
            recipes,
            formattedNextDate,
            dateID:formattedTitleDateTime+'_'+uuid,
            userID
        });

        setShowLoader(false)
        setCaption('')
        setImageLinkURL('')
        
        setToastText('Favorite shared successfully!');
        setShowToast(true);
    }
    
  },[imageLinkURL])

  const shareFavBtn = () => {
    setShowLoader(true);
    setShowCreateModal(false);
  
    if (selectedFile) {
      const fileRef = storageRef(storage, selectedFile.name);
  
      uploadBytes(fileRef, selectedFile)
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then((url) => {
          setImageLinkURL(url);
          // Save the URL to the Realtime Database if needed
          // For example:
          // saveImageLinkToDatabase(url);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    } else {
      setImageLinkURL(
        "http://drive.google.com/uc?export=view&id=1ByrmsfllxPY095bp3B2XULp1rXvaed27"
      );
    }
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
                <div className="socialLinkLabel-inner likedInnerActive active">
                  <img className='socialLinkLabelImage' src={heartIconBlue} alt="" /> 
                  <span className='socialLinkLabelText likedTextActive active'>Favorites</span> 
                </div>
              </div>
              <div className='socialLinkDivider'></div> 
              <div className="totalCreateContainer">
                    <div className="totalCreateContainer-inner">
                        <button type="button" className="btn btn-primary createLinkBtn" onClick={handleShow}> <span>Share</span> </button>
                    </div>
              </div>
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
              <Modal show={showCreateModal} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Share Favorites</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <label htmlFor="createLinkImage" className="form-label userCreateLinkNameLabel">Thumbnail</label>
                            <input type="file" className="form-control" id="createLinkImage" accept="image/png, image/gif, image/jpeg" onChange={(e) => handleFileChange(e)}/>
                            <label htmlFor="floatingTextarea">Caption</label>
                            <textarea className="form-control" placeholder="Leave a caption here" id="floatingTextarea" value={caption} onChange={(e)=>{setCaption(e.target.value)}}></textarea> 
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type='button' onClick={()=>{shareFavBtn()}}>Save</Button>
                    </Modal.Footer>
                </Modal>

        </div>

        {showLoader && 
          <Loader/>
        }

        { showToast &&
            <ToastContainer/>
        }

        
      </section>
    </>
  )
}

export default Profile