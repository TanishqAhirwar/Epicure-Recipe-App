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

const testimonialCarouselContainer = document.getElementById('testimonialCarousel');

testimonials.forEach(t => {
  const div = document.createElement('div');
  div.className = 'item';
  div.innerHTML = `
    <div class="testimonial-content">
      <img src="${t.image}" alt="${t.name}">
      <h3>${t.name}</h3>
      <p>"${t.text}"</p>
    </div>
  `;
  testimonialCarouselContainer.appendChild(div);
});

$(document).ready(function () {
  $('#testimonialCarousel').owlCarousel({
    loop: true,
    margin: 20,
    nav: true,        // Enable next/prev arrows
    dots: true,       // Enable dots
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navText: ['<span class="nav-arrow left">&#8592;</span>', '<span class="nav-arrow right">&#8594;</span>'],
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      1024: { items: 3 }
    }
  });
});