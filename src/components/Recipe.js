import React, { useEffect, useState } from 'react';

import {db} from '../firebase';
import {uid} from 'uid'; 
import { onValue, ref, remove, set, update } from 'firebase/database';
import Cookies from 'universal-cookie';

function Recipe({searchInput, setRecipeNameDashboard, handleRecipeShow, setRecipeImageDashboard, setRecipeAuthorDashboard, setRecipeIngredientsDashboard, setRecipeIdLinkDashboard, setRecipeURLDashboard}) {
    const cookies = new Cookies();
    const [userID, setUserID] = useState(cookies.get('jwt_autorization'));
    const [recipeName, setRecipeName] = useState(cookies.get('jwt_autorization'));
    const [clickLike, setClickLike] = useState(false)
    const [listRecipe, setListRecipe] = useState([]);
    const [displayList, setDisplayList] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 12;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = listRecipe.slice(firstIndex, lastIndex);
    const npage = Math.ceil(listRecipe.length/recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1)

    useEffect(()=>{
        if(searchInput){
            setListRecipe([]);
            fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${searchInput}&app_id=e7e02e83&app_key=%20da551a9f6b2596058ec897a1dd5949ab%09`)
            .then((response) => response.json())
            .then((data) =>{
                // console.log(data.hits)

                data.hits.forEach(element => {
                    // console.log(element.recipe)
                    setRecipeName(element.recipe.label);
                    let liked = true
                    setListRecipe((oldArray) => [...oldArray, [element.recipe.label, element.recipe.mealType, element.recipe.image, element.recipe.source, element.recipe.ingredientLines, element.recipe.uri, element.recipe.url]]);
                    
                });
                // setListRecipe((oldArray) => [...oldArray,])
            })
        } else if(!searchInput){
            setListRecipe([]);
            fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=random&app_id=e7e02e83&app_key=%20da551a9f6b2596058ec897a1dd5949ab%09`)
            .then((response) => response.json())
            .then((data) =>{
                // console.log(data.hits)

                data.hits.forEach(element => {
                    // console.log(element.recipe.url)
                    setRecipeName(element.recipe.label);
                    let liked = true
                    setListRecipe((oldArray) => [...oldArray, [element.recipe.label, element.recipe.mealType, element.recipe.image, element.recipe.source, element.recipe.ingredientLines, element.recipe.uri, element.recipe.url]]);
                    
                    
                });
                // setListRecipe((oldArray) => [...oldArray,])
            })
        } else{
            setListRecipe([]);
        }

        
    },[searchInput]);

    const openRecipeModal = (recipeName,recipeImage,recipeSource,recipeIngredients,recipeUri,recipeUrl) =>{
        handleRecipeShow(); 
        setRecipeNameDashboard(recipeName);
        setRecipeImageDashboard(recipeImage);
        setRecipeAuthorDashboard(recipeSource);
        setRecipeIngredientsDashboard(recipeIngredients);
        setRecipeIdLinkDashboard(recipeUri);
        setRecipeURLDashboard(recipeUrl);
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
            <div key={index} className='recipeContainer' onClick={()=>openRecipeModal(recipe[0],recipe[2],recipe[3],recipe[4],recipe[5],recipe[6])}>
                <div className='recipeContainer-inner'>
                <div className='recipeImageContainer'>
                    <img className='recipeImage' src={recipe[2]}/>
                </div>
                {/* <div className='likeRecipeBtnContainer' onClick={()=>likeRecipe()}>
                    <div className='likeRecipeBtn'>
                        {recipe[3] ? 
                        <img src={heartIconFilled}/>
                        :
                        <img src={heartIcon}/>
                        }
                        
                    </div>
                </div> */}
                <div className='recipeDetailsContainer'>
                    <span className='recipeName'>{recipe[0]}</span>
                    <span className='recipeNumberIngredients'>{recipe[1]}</span>
                </div>
                </div>
            </div>
        ))
        }
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

      
    </>
  )
}

export default Recipe