import React from 'react'

function RecipeCard({recipeName, recipeNumberIngredients, recipeImage, recipeSource, recipeIngredients, recipeUri, recipeUrl, recipeHealthBenifits, openRecipeModal}) {
  return (
    <>
        <div className='recipeContainer' onClick={()=>openRecipeModal(recipeName,recipeImage, recipeSource, recipeIngredients, recipeUri, recipeUrl,recipeHealthBenifits)}>
                <div className='recipeContainer-inner'>
                <div className='recipeImageContainer'>
                    <img className='recipeImage' src={recipeImage}/>
                </div>
                <div className='recipeDetailsContainer'>
                    <span className='recipeName'>{recipeName}</span>
                    <span className='recipeNumberIngredients'>by {recipeSource}</span>
                </div>
                </div>
        </div>
    </>
  )
}

export default RecipeCard