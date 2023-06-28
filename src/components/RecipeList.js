import React, { useEffect, useState } from 'react';

import {db} from '../firebase';
import {uid} from 'uid'; 
import { onValue, ref, remove, set, update } from 'firebase/database';
import Cookies from 'universal-cookie';
import RecipeCard from './RecipeCard';

function Recipe({searchInput, setRecipeNameDashboard, handleRecipeShow, setRecipeImageDashboard, setRecipeAuthorDashboard, setRecipeIngredientsDashboard, setRecipeIdLinkDashboard, setRecipeURLDashboard, setRecipeHealthBenifitsDashboard, clickSearch, setClickSearch}) {
    const cookies = new Cookies();
    const [userID, setUserID] = useState(cookies.get('jwt_autorization'));
    const [recipeName, setRecipeName] = useState(cookies.get('jwt_autorization'));
    const [clickLike, setClickLike] = useState(false)
    const [listRecipe, setListRecipe] = useState([]);
    const [displayList, setDisplayList] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 8;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = listRecipe.slice(firstIndex, lastIndex);
    const npage = Math.ceil(listRecipe.length/recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);

    useEffect(()=>{
        let commonIngredients = [
            'Salt',
            'Pepper',
            'Olive oil',
            'Garlic',
            'Onion',
            'Tomato',
            'Chicken',
            'Beef',
            'Rice',
            'Pasta'
        ];
      let randomIngred = Math.floor(Math.random() * commonIngredients.length);
    if(clickSearch===true){
        if(searchInput !==''){
            setListRecipe([]);
            setCurrentPage(1);
            fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${searchInput}&app_id=e7e02e83&app_key=%20da551a9f6b2596058ec897a1dd5949ab%09`)
            .then((response) => response.json())
            .then((data) =>{
                setListRecipe(data.hits);
                
            }).catch(error => {
                console.log('no data')
              });
              setClickSearch(false);
        } 
        else if(searchInput === ''){
            setListRecipe([]);
            fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${commonIngredients[randomIngred]}&app_id=e7e02e83&app_key=%20da551a9f6b2596058ec897a1dd5949ab%09`)
            .then((response) => response.json())
            .then((data) =>{
                setListRecipe(data.hits);
                
            }).catch(error => {
                console.log('no data')
              });
              setClickSearch(false);
        } else{
            setListRecipe([]);
        }
    } 

    },[clickSearch]);

    useEffect(() =>{
        let commonIngredients = [
            'Salt',
            'Pepper',
            'Olive oil',
            'Garlic',
            'Onion',
            'Tomato',
            'Chicken',
            'Beef',
            'Rice',
            'Pasta'
        ];
            
      let randomIngred = Math.floor(Math.random() * commonIngredients.length);
        setListRecipe([]);
        fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${commonIngredients[randomIngred]}&app_id=e7e02e83&app_key=%20da551a9f6b2596058ec897a1dd5949ab%09`)
        .then((response) => response.json())
        .then((data) =>{
            setListRecipe(data.hits);
        }).catch(error => {
            console.log('no data');
        });
    },[]);

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
    
  return (
    <>
    <div className='RecipeDashboardContainer'>
      {records.map((recipe, index)=>(
            <RecipeCard key={index} recipeName={recipe.recipe.label} recipeNumberIngredients={recipe.recipe.mealType} recipeImage={recipe.recipe.image} recipeSource={recipe.recipe.source} recipeIngredients={recipe.recipe.ingredientLines} recipeUri={recipe.recipe.uri} recipeUrl={recipe.recipe.url} recipeHealthBenifits={recipe.recipe.healthLabels} openRecipeModal={openRecipeModal}/>
        ))
      }
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

    </div>:
    ''

    }

    

      
    </>
  )
}

export default Recipe