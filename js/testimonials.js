const testimonials = [
  {
    name: "Aarav Shah",
    text: "This recipe site is amazing! I’ve discovered so many quick meals and healthy options. Totally love it!",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    name: "Saanvi Mehta",
    text: "As a vegan, it’s tough finding good blogs. But this site has a great variety and everything tastes great!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Ravi Kumar",
    text: "The Indian spice guide helped me level up my cooking game. Simple tips, big impact!",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  }
];

let currentTestimonial = 0;

const testimonialBox = document.getElementById("testimonialContainer");

function showTestimonial(index) {
  const t = testimonials[index];
  testimonialBox.innerHTML = `
    <div class="testimonial-content">
      <img src="${t.image}" alt="${t.name}">
      <h3>${t.name}</h3>
      <p>"${t.text}"</p>
    </div>
  `;
}

// Make these functions globally available
window.nextTestimonial = function () {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
};

window.prevTestimonial = function () {
  currentTestimonial =
    (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  showTestimonial(currentTestimonial);
};

// Initial render
showTestimonial(currentTestimonial);

// Auto-slide every 5 seconds
setInterval(window.nextTestimonial, 5000);
