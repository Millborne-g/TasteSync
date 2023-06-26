import React from 'react';

function RecipeCard({ recipe, openRecipeModal }) {
  const { name, numberIngredients, image, source, ingredients, uri, url, healthBenefits } = recipe;

  return (
    <div className='recipeContainer' onClick={() => openRecipeModal(recipe)}>
      <div className='recipeContainer-inner'>
        <div className='recipeImageContainer'>
          <img className='recipeImage' src={image} alt={name} />
        </div>
        <div className='recipeDetailsContainer'>
          <span className='recipeName'>{name}</span>
          <span className='recipeNumberIngredients'>{numberIngredients} Ingredients</span>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
