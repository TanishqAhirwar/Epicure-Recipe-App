const recipeContainer = document.getElementById('recipeContainer');
const recipeList = document.getElementById('recipeList');
const categoryName = document.getElementById('categoryName');

document.addEventListener("DOMContentLoaded", () => {
  loadRecipesFromURL();
});

function loadRecipesFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  const cuisine = urlParams.get('cuisine');

  if (category && category !== 'null') {
    categoryName.innerText = category;
    fetchRecipesByCategory(category);
  } else if (cuisine && cuisine !== 'null') {
    categoryName.innerText = cuisine + " Cuisine";
    fetchRecipesByCuisine(cuisine);
  } else {
    categoryName.innerText = "All Recipes";
    fetchDefaultRecipes();
  }
}



async function fetchRecipesByCategory(category) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`);
    const data = await res.json();
    displayRecipes(data.meals, category, null);
  } catch (error) {
    console.error('Category fetch error:', error);
    recipeContainer.innerHTML = '<p>Failed to load category recipes.</p>';
  }
}

async function fetchRecipesByCuisine(cuisine) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(cuisine)}`);
    const data = await res.json();
    displayRecipes(data.meals, null, cuisine);
  } catch (error) {
    console.error('Cuisine fetch error:', error);
    recipeContainer.innerHTML = '<p>Failed to load cuisine recipes.</p>';
  }
}

async function fetchDefaultRecipes() {
  try {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const data = await res.json();
    displayRecipes(data.meals); // meals already contain category/cuisine
  } catch (error) {
    console.error('Default fetch error:', error);
    recipeContainer.innerHTML = '<p>Failed to load recipes.</p>';
  }
}


async function displayRecipes(meals, fixedCategory = null, fixedCuisine = null) {
  recipeContainer.innerHTML = '';

  if (!meals) {
    recipeContainer.innerHTML = '<p>No recipes found.</p>';
    return;
  }

  for (const meal of meals) {
    // Get full details to extract category and cuisine
    let fullMeal = meal;
    if (!meal.strCategory || !meal.strArea) {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
      const data = await res.json();
      fullMeal = data.meals ? data.meals[0] : meal;
    }

    const category = fullMeal.strCategory || fixedCategory || 'Unknown';
    const cuisine = fullMeal.strArea || fixedCuisine || 'Unknown';

    const cookTime = '30 min';
    const level = 'Beginner';
    const rating = (Math.random() * 2 + 3).toFixed(1);

    const card = document.createElement('div');
    card.classList.add('recipe-card');
    card.innerHTML = `
      <div class="card-top">
        <span class="rating"><i class="fa fa-star"></i> ${rating}</span>
        <i class="fa fa-heart fav-icon"></i>
        <i class="fa fa-bookmark bookmark-icon"></i>
      </div>
      <img src="${fullMeal.strMealThumb}" alt="${fullMeal.strMeal}">
      <div class="card-content">
        <p class="category">${category}</p>
        <h3 class="recipe-title">${fullMeal.strMeal}</h3>
        <div class="details">
          <span><i class="fa fa-clock"></i> ${cookTime}</span>
          <span><i class="fa fa-globe"></i> ${cuisine}</span>
          <span><i class="fa fa-user"></i> ${level}</span>
        </div>
        <a href="recipe-details.html?id=${meal.idMeal}" class="details-link">View Details</a>
      </div>
    `;

    card.addEventListener('click', () => {
      window.location.href = `recipe-details.html?id=${meal.idMeal}`;
    });
    card.style.cursor = 'pointer';

    recipeContainer.appendChild(card);
  }
}
