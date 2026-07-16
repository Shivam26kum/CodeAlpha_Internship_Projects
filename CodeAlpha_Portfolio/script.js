// Live clock in the top status bar
function tick(){
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit' });
}
tick();
setInterval(tick, 1000);

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelector(".nav__links");
navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
document.querySelectorAll(".nav__links a").forEach(link =>
  link.addEventListener("click", () => navLinks.classList.remove("open")));

// Reveal skill bars when they scroll into view
const bars = document.querySelectorAll(".skill__bar");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
bars.forEach(bar => observer.observe(bar));

// Contact form (front-end only demo — wire up to a backend or form service to actually send)
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
form.addEventListener("submit", e => {
  e.preventDefault();
  status.textContent = "Message received — I'll get back to you soon.";
  form.reset();
});
