// ---- Data ----
// Swap `src` for your own images any time — everything else keeps working.
const frames = [
  { src:"https://picsum.photos/seed/frame01/900/1125", category:"Portrait", caption:"Study in half-light" },
  { src:"https://picsum.photos/seed/frame02/900/1125", category:"Landscape", caption:"Ridge before the storm" },
  { src:"https://picsum.photos/seed/frame03/900/1125", category:"Street", caption:"Corner, 6:14pm" },
  { src:"https://picsum.photos/seed/frame04/900/1125", category:"Portrait", caption:"Quiet hands" },
  { src:"https://picsum.photos/seed/frame05/900/1125", category:"Architecture", caption:"Stairwell, floor 4" },
  { src:"https://picsum.photos/seed/frame06/900/1125", category:"Landscape", caption:"Low tide" },
  { src:"https://picsum.photos/seed/frame07/900/1125", category:"Street", caption:"Waiting for the 9 bus" },
  { src:"https://picsum.photos/seed/frame08/900/1125", category:"Architecture", caption:"Glass and grid" },
  { src:"https://picsum.photos/seed/frame09/900/1125", category:"Portrait", caption:"Between takes" },
  { src:"https://picsum.photos/seed/frame10/900/1125", category:"Landscape", caption:"Fog rolling in" },
  { src:"https://picsum.photos/seed/frame11/900/1125", category:"Street", caption:"Neon, wet asphalt" },
  { src:"https://picsum.photos/seed/frame12/900/1125", category:"Architecture", caption:"Spiral, looking up" },
];

const categories = ["All", ...new Set(frames.map(f => f.category))];

const sheetEl = document.getElementById("sheet");
const filtersEl = document.getElementById("filters");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxIndex = document.getElementById("lightboxIndex");
const lightboxCaption = document.getElementById("lightboxCaption");

let activeCategory = "All";
let visibleFrames = frames;
let currentIndex = 0;
let slideshowTimer = null;

// ---- Render filters ----
categories.forEach(cat => {
  const btn = document.createElement("button");
  btn.className = "filter-btn" + (cat === "All" ? " active" : "");
  btn.textContent = cat;
  btn.addEventListener("click", () => {
    activeCategory = cat;
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b.textContent === cat));
    renderGrid();
  });
  filtersEl.appendChild(btn);
});

// ---- Render grid ----
function renderGrid(){
  visibleFrames = activeCategory === "All" ? frames : frames.filter(f => f.category === activeCategory);
  sheetEl.innerHTML = "";
  visibleFrames.forEach((frame, i) => {
    const card = document.createElement("figure");
    card.className = "frame";
    card.tabIndex = 0;
    card.innerHTML = `
      <img src="${frame.src}" alt="${frame.caption}" loading="lazy">
      <figcaption class="frame__meta">
        <span class="frame__num">${String(i+1).padStart(2,"0")}</span>
        <span>${frame.category}</span>
      </figcaption>`;
    card.addEventListener("click", () => openLightbox(i));
    card.addEventListener("keydown", e => { if(e.key === "Enter") openLightbox(i); });
    sheetEl.appendChild(card);
  });
}

// ---- Lightbox ----
function openLightbox(index){
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}

function closeLightbox(){
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  stopSlideshow();
}

function updateLightbox(){
  const frame = visibleFrames[currentIndex];
  lightboxImg.src = frame.src;
  lightboxImg.alt = frame.caption;
  lightboxIndex.textContent = `${String(currentIndex+1).padStart(2,"0")} / ${String(visibleFrames.length).padStart(2,"0")}`;
  lightboxCaption.textContent = frame.caption;
}

function showNext(){ currentIndex = (currentIndex + 1) % visibleFrames.length; updateLightbox(); }
function showPrev(){ currentIndex = (currentIndex - 1 + visibleFrames.length) % visibleFrames.length; updateLightbox(); }

function toggleSlideshow(){
  if(slideshowTimer){ stopSlideshow(); }
  else { slideshowTimer = setInterval(showNext, 2200); }
}
function stopSlideshow(){
  clearInterval(slideshowTimer);
  slideshowTimer = null;
}

document.getElementById("closeBtn").addEventListener("click", closeLightbox);
document.getElementById("nextBtn").addEventListener("click", showNext);
document.getElementById("prevBtn").addEventListener("click", showPrev);
document.getElementById("backdrop").addEventListener("click", closeLightbox);

document.addEventListener("keydown", e => {
  if(!lightbox.classList.contains("open")) return;
  if(e.key === "Escape") closeLightbox();
  if(e.key === "ArrowRight") showNext();
  if(e.key === "ArrowLeft") showPrev();
  if(e.key.toLowerCase() === "s") toggleSlideshow();
});

renderGrid();
