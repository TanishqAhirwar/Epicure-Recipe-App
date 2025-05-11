// Load category tabs (below tabbed section)
async function loadCategories() {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
  const data = await res.json();

  const tabContainer = document.getElementById('category-tabs');

  data.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-tab';
    btn.setAttribute('data-category', cat.strCategory);
    btn.textContent = cat.strCategory;
    tabContainer.appendChild(btn);
  });

  document.querySelectorAll('.category-tab').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
      button.classList.add('active');
      fetchMealsByCategory(button.dataset.category);
    });
  });

  fetchMealsByCategory('all');
}

// Fetch meals for category section
async function fetchMealsByCategory(category) {
  let meals = [];

  if (category === 'all') {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const data = await res.json();
    meals = data.meals;
  } else {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await res.json();
    meals = data.meals;
  }

  renderMeals(meals.slice(0, 10), 'category-recipes');
}

// Fetch meal details by ID
async function getMealDetailsById(id) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await res.json();
  return data.meals[0];
}

// Render meal cards into given container
function renderMeals(meals, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = meals.map(meal => {
    const rating = (Math.random() * 2 + 3).toFixed(1);
    const cookTime = `${Math.floor(Math.random() * 30 + 20)} mins`;
    const cuisine = meal.strArea || "Global";
    const level = ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)];

    return `
      <div class="meal-card">
        <div class="card-top">
          <span class="rating"><i class="fa fa-star"></i> ${rating}</span>
          <i class="fa fa-heart fav-icon"></i>
          <i class="fa fa-bookmark bookmark-icon"></i>
        </div>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="card-content">
          <p class="category">${meal.strCategory || 'Unknown'}</p>
          <h3 class="recipe-title">${meal.strMeal}</h3>
          <div class="details">
            <span><i class="fa fa-clock"></i> ${cookTime}</span>
            <span><i class="fa fa-globe"></i> ${cuisine}</span>
            <span><i class="fa fa-user"></i> ${level}</span>
          </div>
          <a href="recipe-details.html?id=${meal.idMeal}" class="details-link">View Details</a>
        </div>
      </div>
    `;
  }).join('');
}

// Load recipes in tabbed section with logic
async function loadTabMeals(type) {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
  const data = await res.json();
  let meals = data.meals || [];

  if (type === 'latest') {
    meals = meals.sort((a, b) => b.idMeal - a.idMeal).slice(0, 10);
  }

  else if (type === 'popular') {
    const popularCategories = ['Beef', 'Chicken', 'Dessert'];
    meals = meals.filter(meal => popularCategories.includes(meal.strCategory)).slice(0, 10);
  }

  else if (type === 'fastest') {
    // Count number of ingredients
    const mealsWithIngredients = await Promise.all(meals.slice(0, 20).map(async (meal) => {
      const fullMeal = await getMealDetailsById(meal.idMeal);
      const ingredients = Object.keys(fullMeal).filter(k => k.startsWith('strIngredient') && fullMeal[k]);
      return { ...meal, ingredientCount: ingredients.length };
    }));

    meals = mealsWithIngredients.sort((a, b) => a.ingredientCount - b.ingredientCount).slice(0, 10);
  }

  renderMeals(meals, 'recipe-container');
}

// Tab click handling for tabbed section
document.querySelectorAll('.tab').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    button.classList.add('active');
    loadTabMeals(button.dataset.category);
  });
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadTabMeals('latest');
});
