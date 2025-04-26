// categories.js

const categoryList = document.getElementById('categoryList');

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("categories.html") && categoryList) {
    fetchCategories(categoryList);
  }
});

function fetchCategories(categoryList) {
  fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    .then(response => response.json())
    .then(data => {
      const categories = data.categories;
      if (categories && Array.isArray(categories)) {
        categories.forEach(category => {
          const li = document.createElement('li');
          li.innerHTML = `
            <a href="recipes.html?category=${encodeURIComponent(category.strCategory)}" class="category-card">
              <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="category-img">
              <span class="category-name">${category.strCategory}</span>
            </a>
          `;
          categoryList.appendChild(li);
        });
      } else {
        console.error("No categories found.");
      }
    })
    .catch(error => console.error('Error fetching categories:', error));
}

