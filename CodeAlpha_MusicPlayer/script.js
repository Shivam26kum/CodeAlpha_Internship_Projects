// Swap these for your own tracks — same structure works for any mp3 URL.
const tracks = [
  { title:"Golden Hour", artist:"Aiden Marsh", src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title:"Night Drive", artist:"Coral Static", src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title:"Paper Moon", artist:"Aiden Marsh", src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { title:"Low Tide", artist:"Ferra & Wolfe", src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
];

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const loopBtn = document.getElementById("loopBtn");
const seek = document.getElementById("seek");
const seekFill = document.getElementById("seekFill");
const volume = document.getElementById("volume");
const timeElapsed = document.getElementById("timeElapsed");
const timeTotal = document.getElementById("timeTotal");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const playlistEl = document.getElementById("playlist");
const reelLeft = document.getElementById("reelLeft");
const reelRight = document.getElementById("reelRight");

let currentTrack = 0;
let isLooping = false;
let isSeeking = false;

function formatTime(sec){
  if(!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2,"0");
  return `${m}:${s}`;
}

function loadTrack(index, autoplay){
  currentTrack = (index + tracks.length) % tracks.length;
  const track = tracks[currentTrack];
  audio.src = track.src;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  renderPlaylist();
  if(autoplay) audio.play().catch(()=>{});
}

function renderPlaylist(){
  playlistEl.innerHTML = "";
  tracks.forEach((track, i) => {
    const li = document.createElement("li");
    li.className = i === currentTrack ? "active" : "";
    li.innerHTML = `
      <span class="num">${String(i+1).padStart(2,"0")}</span>
      <span class="meta">${track.title}<small>${track.artist}</small></span>
      <span class="dur">${i === currentTrack ? "▶" : ""}</span>`;
    li.addEventListener("click", () => loadTrack(i, true));
    playlistEl.appendChild(li);
  });
}

function togglePlay(){
  if(audio.paused) audio.play().catch(()=>{});
  else audio.pause();
}

function setSpinning(spinning){
  reelLeft.classList.toggle("spin", spinning);
  reelRight.classList.toggle("spin", spinning);
}

audio.addEventListener("play", () => { playBtn.textContent = "⏸"; setSpinning(true); });
audio.addEventListener("pause", () => { playBtn.textContent = "▶"; setSpinning(false); });
audio.addEventListener("ended", () => { if(!isLooping) loadTrack(currentTrack + 1, true); });

audio.addEventListener("loadedmetadata", () => { timeTotal.textContent = formatTime(audio.duration); });
audio.addEventListener("timeupdate", () => {
  if(isSeeking) return;
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  seek.value = pct;
  seekFill.style.width = pct + "%";
  timeElapsed.textContent = formatTime(audio.currentTime);
});

seek.addEventListener("input", () => {
  isSeeking = true;
  seekFill.style.width = seek.value + "%";
});
seek.addEventListener("change", () => {
  if(audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
  isSeeking = false;
});

volume.addEventListener("input", () => { audio.volume = volume.value; });

playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", () => loadTrack(currentTrack + 1, true));
prevBtn.addEventListener("click", () => loadTrack(currentTrack - 1, true));
loopBtn.addEventListener("click", () => {
  isLooping = !isLooping;
  audio.loop = isLooping;
  loopBtn.classList.toggle("active", isLooping);
});

document.addEventListener("keydown", e => {
  if(e.target.tagName === "INPUT") return;
  if(e.code === "Space"){ e.preventDefault(); togglePlay(); }
  if(e.key === "ArrowRight") loadTrack(currentTrack + 1, true);
  if(e.key === "ArrowLeft") loadTrack(currentTrack - 1, true);
});

audio.volume = volume.value;
loadTrack(0, false);
