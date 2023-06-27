import React, { useEffect, useState } from 'react';
import {db, storage} from '../firebase';
import {uid} from 'uid'; 
import { onValue, ref, remove, set, update } from 'firebase/database';
import { Dropdown, Button, Modal  } from 'react-bootstrap';

import PeopleStoryCard from './PeopleStoryCard';

function PeopleStory() {
  const [userID, setUserID] = useState(localStorage.getItem("jwt_autorization"));
  const [storyList, setStoryList] = useState([]);
  const [showStoryModal, setShowStoryModal] = useState(false);

  const [userImage, setUserImage] = useState('');
  const [userName, setUserName] = useState('');
  const [userDatePosted, setUserDatePosted] = useState('');
  const [userCaption, setUserCaption] = useState('');
  const [userStoryID, setUserStoryID] = useState('');
  const [userRecipeList, setUserRecipeList] = useState([]);
  const [storyDateID, setStoryDateID] = useState([]);

  const [clickDeleteStory, setClickDeleteStory] = useState(false)

  const getStoryData = () =>{
      // Perform actions for returning user
      console.log('Returning user');
      const currentDate = new Date();
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      };

      setStoryList([]);
      onValue(ref(db, '/userStory'), (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          const reversedData = Object.values(data).reverse();
          reversedData.forEach((story) => {
            const dateToday = new Intl.DateTimeFormat('en-US', options).format(currentDate);
            if (dateToday !== story.formattedNextDate) {
              onValue(ref(db, `/users/${story.userID}`), (snapshot) => {
                const userData = snapshot.val();
                if (userData !== null) {
                  setStoryList((oldArray) => [
                    ...oldArray,
                    [
                      story.caption,
                      story.dateID,
                      story.formattedDate,
                      story.imageLinkURL,
                      story.recipes,
                      story.userID,
                      userData.name,
                      userData.imageLink
                    ]
                  ]);
                }
              });
            } else {
              remove(ref(db, `userStory/${story.dateID}`));
            }
          });
        }
      });
      
  }

  useEffect(() => {
    const isFirstTimeUser = !localStorage.getItem('hasVisitedBefore');

    if (isFirstTimeUser) {
      // Perform actions for first-time user
      console.log('First time user');
      localStorage.setItem('hasVisitedBefore', 'true');
      setStoryList([]);
    } else {
      setStoryList([]);
      getStoryData();
    }
  }, []); // Empty dependency array ensures the effect runs only once on component mount


  const handleClose = () => {
    setShowStoryModal(false);
  };

  const storyShow = (caption, formattedDate, userName, userImage, listRecipe, storyUserID,storyDateIDDB) => {
    setShowStoryModal(true);
    setUserImage(userImage);
    setUserName(userName);
    setUserDatePosted(formattedDate);
    setUserCaption(caption);
    setUserRecipeList(listRecipe);
    setUserStoryID(storyUserID);
    setStoryDateID(storyDateIDDB);

    Object.keys(userRecipeList).forEach((recipeKey) => {
      const recipe = userRecipeList[recipeKey];
      const searchInput = recipe.searchInput; // Replace 'searchInput' with the actual property name
      console.log("Search Input:", userRecipeList[recipeKey].searchInput);
    });
  };

  useEffect(()=>{
    setStoryList([]);
    getStoryData();
    setClickDeleteStory(false);
  },[clickDeleteStory])

  const deleteStory = () =>{
    setClickDeleteStory(true);
    handleClose()
    remove(ref(db, `userStory/${storyDateID}`));
  }

  return (
    <>
      <div className='peoplesMealPlanContainer'>
        {storyList.map((story, index) =>(
          <PeopleStoryCard key={index} story={story} storyShow={storyShow}/>
        ))}
      </div>

      <Modal show={showStoryModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
          <Modal.Title>Story</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='storyPopUpUserContainer'>
              <div className='storyPopUpUserImageContainer'>
                <img className='storyPopUpUserImage' src={userImage}/>
              </div>
              <div className='storyPopUpUserDetailsContainer'>
                <span className='storyPopUpUserName'>{userName}</span>
                <span className='storyPopUpUserDatePosted'>{userDatePosted}</span>
              </div>
            </div>

            <div className='storyPopUpUserCaptionContainer'>
              <span className='storyPopUpUserCaption'>
                {userCaption}
              </span>
            </div>
            <div className='storyPopUpUserRecipeContainer'>
              
              {Object.keys(userRecipeList).map((recipeKey) => (
                <a key={recipeKey} className='storyPopUpUserRecipe' href={userRecipeList[recipeKey].recipeURLDashboard} target='_blank'>
                  <div className='storyPopUpUserRecipeImageContainer'>
                    <img className='storyPopUpUserRecipeImage' src={userRecipeList[recipeKey].recipeImageDashboard}/>
                  </div>
                  <div className='storyPopUpUserRecipeDetailsContainer'>
                    <span className='storyPopUpUserRecipeName'>{userRecipeList[recipeKey].recipeNameDashboard}</span> <br/>
                    <span className='storyPopUpUserRecipeAuthor'>{userRecipeList[recipeKey].recipeAuthorDashboard}</span>
                  </div>
                </a>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
          {userID === userStoryID &&
            <Button variant="danger" onClick={() => {deleteStory();}}>
              delete
            </Button>
          }
          <Button variant="secondary" onClick={handleClose}>
              Close
          </Button>
          </Modal.Footer>
      </Modal>
        
    </>
  )
}

export default PeopleStory