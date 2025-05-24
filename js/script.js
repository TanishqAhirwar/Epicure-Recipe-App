// Load category tabs (below tabbed section)
async function loadCategories() {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
  const data = await res.json();

  const tabContainer = document.getElementById('category-tabs');

  data.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-tab';
    btn.setAttribute('data-category', cat.strCategory);
    btn.setAttribute('aria-pressed', 'false');
    btn.textContent = cat.strCategory;
    tabContainer.appendChild(btn);
  });

  // Tab click logic
  document.querySelectorAll('.category-tab').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
      fetchMealsByCategory(button.dataset.category);
    });
  });

  fetchMealsByCategory('all'); // Load default
}

// Fetch meals by category
async function fetchMealsByCategory(category) {
  let meals = [];

  try {
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
  } catch (err) {
    console.error(err);
  }
}

// Get full meal details by ID
async function getMealDetailsById(id) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await res.json();
  return data.meals[0];
}

// Render meal cards into a container
function renderMeals(meals, containerId) {
  const container = document.getElementById(containerId);
  if (!meals) {
    container.innerHTML = '<p>No meals found.</p>';
    return;
  }

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

// Load tabbed section meals (Latest, Popular, Fastest)
async function loadTabMeals(type) {
  const container = document.getElementById('recipe-container');
  container.innerHTML = "<p>Loading meals...</p>";

  const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
  const data = await res.json();
  let meals = data.meals || [];

  try {
    if (type === 'latest') {
      meals = meals.sort((a, b) => b.idMeal - a.idMeal).slice(0, 10);
    } else if (type === 'popular') {
      const popularCategories = ['Beef', 'Chicken', 'Dessert'];
      meals = meals.filter(meal => popularCategories.includes(meal.strCategory)).slice(0, 10);
    } else if (type === 'fastest') {
      const topMeals = meals.slice(0, 20);
      const settledResults = await Promise.allSettled(topMeals.map(meal => getMealDetailsById(meal.idMeal)));

      const mealsWithIngredients = settledResults
        .filter(result => result.status === "fulfilled" && result.value)
        .map(result => {
          const meal = result.value;
          const ingredients = Object.keys(meal).filter(k => k.startsWith("strIngredient") && meal[k]);
          return { ...meal, ingredientCount: ingredients.length };
        });

      meals = mealsWithIngredients.sort((a, b) => a.ingredientCount - b.ingredientCount).slice(0, 10);
    }

    renderMeals(meals, 'recipe-container');
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load tabbed meals.</p>";
  }
}

// Tab click handler
document.querySelectorAll('.tab').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
      tab.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    loadTabMeals(button.dataset.category);
  });
});

// Homepage search handler
function handleSearch() {
  const query = document.getElementById("search-input").value.trim();
  if (!query) return alert("Please enter a recipe name");
  localStorage.setItem("searchQuery", query);
  window.location.href = "recipes.html";
}
window.handleSearch = handleSearch;

// Fetch and show search results on recipes.html
async function fetchSearchResults(query) {
  const container = document.getElementById("recipe-container");
  container.innerHTML = "<p>Loading recipes...</p>";

  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();
    const meals = data.meals;

    container.innerHTML = "";

    if (!meals) {
      container.innerHTML = `<p>No results found for "${query}".</p>`;
      return;
    }

    meals.forEach(meal => {
      const card = `
        <div class="recipe-card">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="recipe-img" />
          <div class="recipe-info">
            <h3>${meal.strMeal}</h3>
            <p>${meal.strCategory || 'Unknown'} | ${meal.strArea || 'Global'}</p>
            <a href="recipe-details.html?id=${meal.idMeal}" class="details-link">View Recipe</a>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });

  } catch (error) {
    container.innerHTML = "<p>Something went wrong while fetching recipes.</p>";
    console.error(error);
  }
}

// Initial Page Load Logic
document.addEventListener("DOMContentLoaded", () => {
  const isRecipesPage = window.location.pathname.includes("recipes.html");

  if (isRecipesPage) {
    const query = localStorage.getItem("searchQuery");
    if (query) {
      fetchSearchResults(query);
      localStorage.removeItem("searchQuery");
    }
  } else {
    loadCategories();
    loadTabMeals("latest"); // Default selected tab
  }
});
