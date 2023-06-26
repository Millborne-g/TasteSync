import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { uid } from 'uid';
import { onValue, ref, remove, set, update } from 'firebase/database';
import RecipeCard from './RecipeCard';
import Cookies from 'universal-cookie';

function RecipeList({ searchInput, setRecipeNameDashboard, handleRecipeShow, setRecipeImageDashboard, setRecipeAuthorDashboard, setRecipeIngredientsDashboard, setRecipeIdLinkDashboard, setRecipeURLDashboard, setRecipeHealthBenifitsDashboard }) {
  const cookies = new Cookies();
  const [userID, setUserID] = useState(cookies.get('jwt_autorization'));
  const [clickLike, setClickLike] = useState(false);
  const [listRecipe, setListRecipe] = useState([]);
  const [displayList, setDisplayList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 12;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = listRecipe.slice(firstIndex, lastIndex);
  const npage = Math.ceil(listRecipe.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  useEffect(() => {
    setListRecipe([]);

    const fetchRecipes = () => {
      let apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&app_id=e7e02e83&app_key=da551a9f6b2596058ec897a1dd5949ab`;

      if (searchInput) {
        apiUrl += `&q=${searchInput}`;
      } else {
        apiUrl += '&q=random';
      }

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
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

            setListRecipe(recipes);
          }
        })
        .catch((error) => {
          console.error('Error fetching recipes:', error);
        });
    };

    fetchRecipes();
  }, [searchInput]);

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

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const changeCpage = (id) => {
    setCurrentPage(id);
  };

  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <>
      <div className='RecipeDashboardContainer'>
        {records.map((recipe, index) => (
          <RecipeCard key={index} recipe={recipe} openRecipeModal={openRecipeModal} />
        ))}
      </div>

      <div className='paginationContainer'>
        <ul className='pagination'>
          <li className='page-item'>
            <a href='#' className='page-link' onClick={prePage}>
              prev
            </a>
          </li>
          {numbers.map((n, i) => (
            <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={i}>
              <a href='#' className='page-link' onClick={() => changeCpage(n)}>
                {n}
              </a>
            </li>
          ))}
          <li className='page-item'>
            <a href='#' className='page-link' onClick={nextPage}>
              Next
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default RecipeList;
