// Fetch all categories and add to tabs
async function loadCategories() {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
  const data = await res.json();

  const tabContainer = document.getElementById('category-tabs');

  // Add all category buttons
  data.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-tab';
    btn.setAttribute('data-category', cat.strCategory);
    btn.textContent = cat.strCategory;
    tabContainer.appendChild(btn);
  });

  // Set up tab click events
  document.querySelectorAll('.category-tab').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
      button.classList.add('active');

      const selectedCategory = button.dataset.category;
      fetchMealsByCategory(selectedCategory); // Always call this regardless of "all"
    });
  });

  // Load All Recipes on first load
  fetchMealsByCategory('all');
}

// Fetch meals for a category
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

  renderMeals(meals.slice(0, 10)); // always show only first 10
}

// Render cards
function renderMeals(meals) {
  const container = document.getElementById('category-recipes');
  container.innerHTML = meals.map(meal => {
    // Dummy placeholders for now
    const rating = (Math.random() * 2 + 3).toFixed(1); // between 3.0 - 5.0
    const cookTime = `${Math.floor(Math.random() * 30 + 20)} mins`; // 20-50 mins
    const cuisine = meal.strArea || "Global"; // or unknown
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


// Load categories
loadCategories();

 
  // Dummy static recipe data (replace with actual API if needed)
  const recipesData = {
    latest: [
      { name: 'Creamy Chicken', img: 'https://www.themealdb.com/images/media/meals/1529446137.jpg' },
      { name: 'Grilled Salmon', img: 'https://www.themealdb.com/images/media/meals/1548772327.jpg' },
      // Add more latest recipes...
    ],
    popular: [
      { name: 'Spaghetti Bolognese', img: 'https://www.themealdb.com/images/media/meals/sutysw1468247559.jpg' },
      { name: 'Chicken Tikka', img: 'https://www.themealdb.com/images/media/meals/urpvvv1511794034.jpg' },
      // Add more popular recipes...
    ],
    fastest: [
      { name: 'Fried Rice', img: 'https://www.themealdb.com/images/media/meals/1529443236.jpg' },
      { name: 'Avocado Toast', img: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg' },
      // Add more fastest recipes...
    ]
  };

  function renderRecipes(category) {
    const container = document.getElementById('recipe-container');
    const recipes = recipesData[category];

    container.innerHTML = recipes.map(recipe => `
      <div class="recipe-card">
        <img src="${recipe.img}" alt="${recipe.name}">
        <h4>${recipe.name}</h4>
      </div>
    `).join('');
  }

  // Handle tab clicks
  document.querySelectorAll('.tab').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      button.classList.add('active');

      const selectedCategory = button.dataset.category;
      renderRecipes(selectedCategory);
    });
  });

  // Initial render
  renderRecipes('latest');
 
