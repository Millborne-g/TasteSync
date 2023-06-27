import React from 'react'

function PeopleStoryCard({story, storyShow}) {
  return (
    <>
        <div className='mealPlanStoryContainer' onClick={()=>storyShow(story[0], story[2], story[6], story[7], story[4])}>
          <div className='mealPlanStoryContainer-inner'>
            <div className='mealPlanStoryImageContainer'>
              <div className='mealPlanStoryUserContainer'>
                <img className='mealPlanStoryUserImage' src={story[7]}/>
                <span className='mealPlanStoryUserName' >{story[6]}</span>
              </div>
              <img className='mealPlanStoryImage' src={story[3]}/>
              <div className='mealPlanStoryUserContainerBottomContainer'></div>
            </div>
          </div>
        </div>
    
    </>
  )
}

export default PeopleStoryCard