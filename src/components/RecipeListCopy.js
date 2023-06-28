import React, { useEffect, useState } from 'react';

import {db} from '../firebase';
import {uid} from 'uid'; 
import { onValue, ref, remove, set, update } from 'firebase/database';
import Cookies from 'universal-cookie';
import RecipeCard from './RecipeCard';

function Recipe() {
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

    const [getDataCounter, setGetDataCouter] = useState(0);


    const getRecipe = async () =>{
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

      const response = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${commonIngredients[randomIngred]}&app_id=e7e02e83&app_key=%20da551a9f6b2596058ec897a1dd5949ab%09`);
      const data = await response.json();
      data.hits.forEach(element => {
              // console.log(element.recipe.url)
            // setListRecipe((oldArray) => [...oldArray, [element.recipe.label, element.recipe.mealType, element.recipe.image, element.recipe.source, element.recipe.ingredientLines, element.recipe.uri, element.recipe.url, element.recipe.healthLabels]]);
       });
       
       setListRecipe(data.hits)

      
    //   fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${commonIngredients[randomIngred]}&app_id=e7e02e83&app_key=%20da551a9f6b2596058ec897a1dd5949ab%09`)
    //   .then((response) => response.json())
    //   .then((data) =>{
    //       // console.log(data.hits)
    //       data.hits.forEach(element => {
    //           // console.log(element.recipe.url)
    //           setListRecipe((oldArray) => [...oldArray, [element.recipe.label, element.recipe.mealType, element.recipe.image, element.recipe.source, element.recipe.ingredientLines, element.recipe.uri, element.recipe.url, element.recipe.healthLabels]]);
    //       });
    //       // setListRecipe((oldArray) => [...oldArray,])
    //   }).catch(error => {
    //       console.log('no data');
    //   });
    }

    useEffect(()=>{
        getRecipe();
    },[]);


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
        <>
            {console.log('im here hellooo '+recipe.recipe.label)}
            <RecipeCard key={index} recipeName={recipe[0]} recipeNumberIngredients={recipe[1]} recipeImage={recipe[2]} recipeSource={recipe[3]} recipeIngredients={recipe[4]} recipeUri={recipe[5]} recipeUrl={recipe[6]} recipeHealthBenifits={recipe[7]} openRecipeModal={'openRecipeModal'}/>
        </>
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