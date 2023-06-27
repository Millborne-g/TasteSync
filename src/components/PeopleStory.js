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
  const [userRecipeList, setUserRecipeList] = useState();

  useEffect(() =>{

    setStoryList([]);
    const currentDate = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    onValue(ref(db, `/userStory`), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setStoryList([]);
        const reversedData = Object.values(data).reverse();
        reversedData.forEach((story) => {
            const dateToday = new Intl.DateTimeFormat('en-US', options).format(currentDate);
            if(dateToday !== story.formattedNextDate){
              onValue(ref(db, `/users/${story.userID}`), (snapshot) => {
                const userData = snapshot.val();
                if (userData !== null) {
                  setStoryList((oldArray) =>[...oldArray, [story.caption, story.dateID, story.formattedDate, story.imageLinkURL, story.listRecipe, story.userID, userData.name, userData.imageLink]])
                }
              })
            
            } else{
              remove(ref(db, `/${story.formattedNextDate}`));
            }
            
        });
      }
    });
  },[]);

  const handleClose = () => {
    setShowStoryModal(false);
  };

  const storyShow = (caption, formattedDate, userName, userImage, listRecipe) => {
    setShowStoryModal(true);
    setUserImage(userImage);
    setUserName(userName);
    setUserDatePosted(formattedDate);
    setUserCaption(caption);
    setUserRecipeList(listRecipe);
    console.log(userRecipeList);
  };

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
            {/* {userImage}
            {userName}
            {userDatePosted}
            {userCaption}
            {userRecipeList} */}
            <div className='storyPopUpUserRecipeContainer'>
              {userRecipeList.map((recipe, index) => (
                <span key={index}>{recipe}</span>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
              Close
          </Button>
          </Modal.Footer>
      </Modal>
        
    </>
  )
}

export default PeopleStory