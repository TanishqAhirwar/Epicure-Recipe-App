const cuisineList = document.getElementById('cuisineList');

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes('cuisine.html') && cuisineList) {
    fetchCuisines(cuisineList);
  }
});

function fetchCuisines(cuisineList) {
  fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
    .then(res => res.json())
    .then(data => {
      const cuisines = data.meals;

      if (cuisines && Array.isArray(cuisines)) {
        cuisines.forEach(cuisine => {
          const li = document.createElement('li');
          li.innerHTML = `<a href="recipes.html?cuisine=${encodeURIComponent(cuisine.strArea)}">${cuisine.strArea}</a>`;
          cuisineList.appendChild(li);
        });
      } else {
        cuisineList.innerHTML = '<li>No cuisines found.</li>';
      }
    })
    .catch(err => {
      console.error("Error fetching cuisines:", err);
      cuisineList.innerHTML = '<li>Error loading cuisines.</li>';
    });
}