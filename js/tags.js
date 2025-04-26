const recipeTags = [
  "Vegan",
  "Vegetarian",
  "Gluten-Free",
  "Quick Meals",
  "Dessert",
  "Breakfast",
  "Dinner",
  "Snacks",
  "Low Carb",
  "Indian",
  "Italian",
  "Healthy"
];

const tagsContainer = document.getElementById("tagsContainer");

recipeTags.forEach(tag => {
  const tagElement = document.createElement("span");
  tagElement.className = "tag";
  tagElement.textContent = tag;
  tagsContainer.appendChild(tagElement);
});
