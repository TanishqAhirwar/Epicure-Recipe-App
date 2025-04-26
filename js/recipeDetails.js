const container = document.getElementById('recipeDetailsContainer');

// Get Meal ID from URL
const params = new URLSearchParams(window.location.search);
const mealId = params.get('id');

async function fetchRecipeDetails(id) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();
    const meal = data.meals[0];

    displayMealDetails(meal);
  } catch (err) {
    container.innerHTML = "<p>Error loading recipe details.</p>";
    console.error("Error:", err);
  }
}

function displayMealDetails(meal) {
  const ingredients = [];

  // Collect ingredients and measures
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure} ${ingredient}`);
    }
  }

  container.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <p><strong>Category:</strong> ${meal.strCategory}</p>
    <p><strong>Cuisine:</strong> ${meal.strArea}</p>
    <h3>Ingredients</h3>
    <ul>${ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
    <h3>Instructions</h3>
    <p>${meal.strInstructions}</p>
    ${meal.strYoutube ? `<h3>Video</h3><a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a>` : ''}
  `;
}

if (mealId) {
  fetchRecipeDetails(mealId);
} else {
  container.innerHTML = "<p>No recipe ID provided.</p>";
}
