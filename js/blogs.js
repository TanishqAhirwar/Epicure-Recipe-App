const foodBlogs = [
  {
    id: 1,
    title: "5 Easy Weeknight Dinners Under 30 Minutes",
    author: "Jane Cooks",
    category: "Quick Meals",
    summary:
      "Tired after work? These quick and delicious dinners can be made in under 30 minutes. Perfect for busy weeknights!",
    image: "./assets/dinner.jpg",
    link: "https://foodieblog.com/easy-weeknight-dinners",
  },
  {
    id: 2,
    title: "Vegan Delights: Tasty and Healthy Recipes",
    author: "GreenChef",
    category: "Vegan",
    summary:
      "Explore our favorite vegan recipes that are not only healthy but bursting with flavor. Great for beginners!",
    image: "./assets/vegan.jpg",
    link: "https://foodieblog.com/vegan-delights",
  },
  {
    id: 3,
    title: "Mastering Indian Spices: A Beginner’s Guide",
    author: "Spice Route",
    category: "Indian Cuisine",
    summary:
      "Learn how to use Indian spices like turmeric, cumin, and cardamom to bring your dishes to life.",
    image: "./assets/indianspices.jpg",
    link: "https://foodieblog.com/indian-spices-guide",
  },
];

// render cards
const container = document.getElementById("blogContainer");

foodBlogs.forEach((blog) => {
  const card = document.createElement("div");
  card.className = "blog-card";
  card.innerHTML = `
    <img src="${blog.image}" alt="${blog.title}" />
    <div class="blog-content">
      <h3>${blog.title}</h3>
      <p class="blog-summary">${blog.summary}</p>
      <p class="blog-author">By ${blog.author} · ${blog.category}</p>
      <a href="${blog.link}" target="_blank">Read More</a>
    </div>
  `;
  container.appendChild(card);
});
