/* ═══════════════════════════════════════════════════════
   ÆTHER — Music Streaming  |  script.js
   ═══════════════════════════════════════════════════════

   HOW TO ADD YOUR OWN SONGS:
   1. Place .mp3 files in the /music folder
   2. Place cover images in the /covers folder
   3. Add an entry to the `songs` array below following
      the same pattern as the samples.

   ═══════════════════════════════════════════════════════ */

// ──────────────────────────────────────────────────────
//  SONG LIBRARY  ← Edit this array to manage your music
// ──────────────────────────────────────────────────────
const songs = [
  {
    id: 1,
    title:  "Neon Shoes - 1",
    artist: "xeypredix",
    album:  "City Lights",
    genre:  "Synthwave",
    src:    "music/Neon Shoes - 1.mp3",
    cover:  "covers/midnight-drive.jpg",
    duration: "4:02"
  },
  {
    id: 2,
    title:  "Neon Shoes - 2",
    artist: "xeypredix",
    album:  "Tides",
    genre:  "Chillwave",
    src:    "music/Neon Shoes - 2.mp3",
    cover:  "covers/ocean-bloom.jpg",
    duration: "4:34"
  },
  {
    id: 3,
    title:  "Moonlight Haze - 1",
    artist: "xeypredix",
    album:  "Orbit",
    genre:  "Indie Pop",
    src:    "music/Moonlight Haze - 1.mp3",
    cover:  "covers/gravity-pull.jpg",
    duration: "3:21"
  },
  {
    id: 4,
    title:  "Moonlight Haze - 2",
    artist: "xeypredix",
    album:  "Warmth",
    genre:  "Lo-fi",
    src:    "music/Moonlight Haze - 2.mp3",
    cover:  "covers/golden-hour.jpg",
    duration: "3:04"
  },
  {
    id: 5,
    title:  "Dark Side Tide  - 1",
    artist: "xeypredix",
    album:  "City Lights",
    genre:  "Synthwave",
    src:    "music/Dark Side Tide  - 1.mp3",
    cover:  "covers/stellar-wind.jpg",
    duration: "3:21"
  },
  {
    id: 6,
    title:  "Dark Side Tide - 2",
   artist: "xeypredix",
    album:  "Foliage",
    genre:  "Ambient",
    src:    "music/Dark Side Tide - 2.mp3",
    cover:  "covers/forest-rain.jpg",
    duration: "3:37"
  },
  { 
  id: 7,
    title:  "Stars Bleeding",
   artist: "xeypredix",
    album:  "Foliage",
    genre:  "Ambient",
    src:    "music/Stars Bleeding.mp3",
    cover:  "covers/forest-rain.jpg",
    duration: "4:42"
  },
   
];

// ──────────────────────────────────────────────────────
//  GRADIENT PALETTES  (used as fallback covers)
// ──────────────────────────────────────────────────────
const gradients = [
  ["#4ff0c0","#7b6fff"],
  ["#ff6b9d","#c44dff"],
  ["#ffd97d","#ff6b6b"],
  ["#43e97b","#38f9d7"],
  ["#4facfe","#00f2fe"],
  ["#fa709a","#fee140"],
  ["#a1c4fd","#c2e9fb"],
  ["#f093fb","#f5576c"],
];

// ──────────────────────────────────────────────────────
//  STATE
// ──────────────────────────────────────────────────────
let currentIndex  = -1;   // index in filteredSongs
let isPlaying     = false;
let isShuffle     = false;
let isRepeat      = false;
let isMuted       = false;
let volume        = 0.8;
let isDraggingProgress = false;
let isDraggingVolume   = false;
let filteredSongs = [...songs];

// ──────────────────────────────────────────────────────
//  DOM REFS
// ──────────────────────────────────────────────────────
const audio         = document.getElementById("audioPlayer");
const songsGrid     = document.getElementById("songsGrid");
const playlistEl    = document.getElementById("playlist");
const songCountEl   = document.getElementById("songCount");
const searchInput   = document.getElementById("searchInput");

// Hero
const heroDiscImg   = document.getElementById("heroDiscImg");
const heroDisc      = document.getElementById("heroDisc");
const heroPlayBtn   = document.getElementById("heroPlay");

// Now Playing Banner
const banner        = document.getElementById("nowPlayingBanner");
const npCover       = document.getElementById("npCover");
const npTitle       = document.getElementById("npTitle");
const npArtist      = document.getElementById("npArtist");

// Player bar
const playerThumb   = document.getElementById("playerThumb");
const playerTitle   = document.getElementById("playerTitle");
const playerArtist  = document.getElementById("playerArtist");
const playPauseBtn  = document.getElementById("playPauseBtn");
const iconPlay      = playPauseBtn.querySelector(".icon-play");
const iconPause     = playPauseBtn.querySelector(".icon-pause");
const prevBtn       = document.getElementById("prevBtn");
const nextBtn       = document.getElementById("nextBtn");
const shuffleBtn    = document.getElementById("shuffleBtn");
const repeatBtn     = document.getElementById("repeatBtn");
const likeBtn       = document.getElementById("likeBtn");
const muteBtn       = document.getElementById("muteBtn");
const iconVol       = muteBtn.querySelector(".icon-vol");
const iconMute      = muteBtn.querySelector(".icon-mute");

// Progress
const progressBar     = document.getElementById("progressBar");
const progressFilled  = document.getElementById("progressFilled");
const progressThumb   = document.getElementById("progressThumb");
const currentTimeEl   = document.getElementById("currentTime");
const totalTimeEl     = document.getElementById("totalTime");

// Volume
const volumeBar       = document.getElementById("volumeBar");
const volumeFilled    = document.getElementById("volumeFilled");
const volumeThumb     = document.getElementById("volumeThumb");

// Sidebar
const sidebar         = document.getElementById("sidebar");
const sidebarOverlay  = document.getElementById("sidebarOverlay");
const menuBtn         = document.getElementById("menuBtn");
const sidebarClose    = document.getElementById("sidebarClose");

// ──────────────────────────────────────────────────────
//  INIT
// ──────────────────────────────────────────────────────
function init() {
  audio.volume = volume;
  renderGrid(filteredSongs);
  renderPlaylist(filteredSongs);
  songCountEl.textContent = `${songs.length} tracks`;

  // Set hero disc to first song cover
  setHeroDisc(songs[0]);
}

// ──────────────────────────────────────────────────────
//  RENDER GRID
// ──────────────────────────────────────────────────────
function renderGrid(list) {
  songsGrid.innerHTML = "";
  if (list.length === 0) {
    document.getElementById("noResults").style.display = "block";
    return;
  }
  document.getElementById("noResults").style.display = "none";

  list.forEach((song, i) => {
    const card = document.createElement("div");
    card.className = "song-card" + (currentIndex !== -1 && filteredSongs[currentIndex]?.id === song.id ? " active" : "");
    card.dataset.id = song.id;
    card.style.animationDelay = `${i * 40}ms`;

    // Determine if we're currently playing this card
    const isActive = currentIndex !== -1 && filteredSongs[currentIndex]?.id === song.id;
    const playIcon = isActive && isPlaying
      ? `<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
      : `<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;

    card.innerHTML = `
      <div class="card-cover-wrap">
        <img
          class="card-cover"
          src="${song.cover}"
          alt="${song.title}"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
        />
        <div class="card-cover-fallback" style="display:none;width:100%;height:100%;background:linear-gradient(135deg,${gradients[i % gradients.length][0]},${gradients[i % gradients.length][1]});align-items:center;justify-content:center;font-size:36px;position:absolute;top:0;left:0;border-radius:10px;">♫</div>
        <span class="card-num">${String(i+1).padStart(2,'0')}</span>
        <button class="card-play-btn" aria-label="Play ${song.title}">
          ${playIcon}
        </button>
      </div>
      <div class="card-info">
        <p class="card-title">${song.title}</p>
        <p class="card-artist">${song.artist}</p>
        <div class="card-footer">
          <span class="card-genre">${song.genre}</span>
          <span class="card-dur">${song.duration}</span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      const idx = filteredSongs.findIndex(s => s.id === song.id);
      if (idx === currentIndex && isPlaying) {
        pauseTrack();
      } else if (idx === currentIndex) {
        playTrack();
      } else {
        loadAndPlay(idx);
      }
    });

    songsGrid.appendChild(card);
  });
}

// ──────────────────────────────────────────────────────
//  RENDER PLAYLIST SIDEBAR
// ──────────────────────────────────────────────────────
function renderPlaylist(list) {
  playlistEl.innerHTML = "";
  list.forEach((song, i) => {
    const isActive = currentIndex !== -1 && filteredSongs[currentIndex]?.id === song.id;
    const li = document.createElement("li");
    li.className = "playlist-item" + (isActive ? " active" : "");
    li.dataset.id = song.id;

    li.innerHTML = `
      <span class="playlist-item-num">${i + 1}</span>
      <span class="playlist-item-playing">▶</span>
      <img
        class="playlist-item-img"
        src="${song.cover}"
        alt="${song.title}"
        onerror="this.style.background='linear-gradient(135deg,${gradients[i % gradients.length][0]},${gradients[i % gradients.length][1]})'"
      />
      <div class="playlist-item-info">
        <p class="playlist-item-title">${song.title}</p>
        <p class="playlist-item-artist">${song.artist}</p>
      </div>
      <span class="playlist-item-dur">${song.duration}</span>
    `;

    li.addEventListener("click", () => {
      const idx = filteredSongs.findIndex(s => s.id === song.id);
      loadAndPlay(idx);
    });

    playlistEl.appendChild(li);
  });
}

// ──────────────────────────────────────────────────────
//  LOAD & PLAY
// ──────────────────────────────────────────────────────
function loadAndPlay(index) {
  if (index < 0 || index >= filteredSongs.length) return;
  currentIndex = index;
  const song = filteredSongs[currentIndex];

  audio.src = song.src;
  audio.load();
  audio.play().catch(() => {
    // Autoplay blocked — update UI anyway
    updatePlayPauseUI(false);
  });

  isPlaying = true;
  updateAllUI(song);
}

function playTrack() {
  if (currentIndex === -1) { loadAndPlay(0); return; }
  audio.play();
  isPlaying = true;
  updatePlayPauseUI(true);
  heroDisc.classList.add("spinning");
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  updatePlayPauseUI(false);
  heroDisc.classList.remove("spinning");
}

function togglePlay() {
  if (currentIndex === -1) { loadAndPlay(0); return; }
  isPlaying ? pauseTrack() : playTrack();
}

function nextTrack() {
  if (filteredSongs.length === 0) return;
  let next;
  if (isShuffle) {
    do { next = Math.floor(Math.random() * filteredSongs.length); }
    while (next === currentIndex && filteredSongs.length > 1);
  } else {
    next = (currentIndex + 1) % filteredSongs.length;
  }
  loadAndPlay(next);
}

function prevTrack() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  const prev = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
  loadAndPlay(prev);
}

// ──────────────────────────────────────────────────────
//  UI UPDATES
// ──────────────────────────────────────────────────────
function updateAllUI(song) {
  // Player bar
  playerTitle.textContent  = song.title;
  playerArtist.textContent = song.artist;
  setImgWithFallback(playerThumb, song.cover, song.title, gradients[currentIndex % gradients.length]);

  // Now Playing Banner
  npTitle.textContent  = song.title;
  npArtist.textContent = song.artist;
  setImgWithFallback(npCover, song.cover, song.title, gradients[currentIndex % gradients.length]);
  banner.classList.add("visible");

  // Hero disc
  setHeroDisc(song);

  // Play/Pause icon
  updatePlayPauseUI(true);

  // Cards + playlist highlights
  renderGrid(filteredSongs);
  renderPlaylist(filteredSongs);
}

function setImgWithFallback(imgEl, src, alt, grad) {
  imgEl.alt = alt;
  imgEl.onerror = () => {
    imgEl.style.objectFit = "cover";
    imgEl.src = createGradientDataUrl(grad[0], grad[1]);
  };
  imgEl.src = src;
}

function setHeroDisc(song) {
  heroDiscImg.alt = song.title;
  heroDiscImg.onerror = () => {
    heroDiscImg.src = createGradientDataUrl(
      gradients[songs.indexOf(song) % gradients.length][0],
      gradients[songs.indexOf(song) % gradients.length][1]
    );
  };
  heroDiscImg.src = song.cover;
}

// Create a tiny SVG gradient as a data URL for fallback images
function createGradientDataUrl(color1, color2) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${color1}'/>
        <stop offset='100%' stop-color='${color2}'/>
      </linearGradient>
    </defs>
    <rect width='200' height='200' fill='url(#g)'/>
    <text x='50%' y='54%' font-size='72' text-anchor='middle' dominant-baseline='middle' fill='rgba(0,0,0,0.3)'>♫</text>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function updatePlayPauseUI(playing) {
  iconPlay.style.display  = playing ? "none"  : "inline";
  iconPause.style.display = playing ? "inline" : "none";
  if (playing) {
    heroDisc.classList.add("spinning");
  } else {
    heroDisc.classList.remove("spinning");
  }
}

// ──────────────────────────────────────────────────────
//  PROGRESS
// ──────────────────────────────────────────────────────
function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2,"0")}`;
}

audio.addEventListener("timeupdate", () => {
  if (isDraggingProgress || !audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFilled.style.width = pct + "%";
  progressThumb.style.left   = pct + "%";
  currentTimeEl.textContent  = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play();
  } else {
    nextTrack();
  }
});

// Progress bar seeking
function seekTo(e) {
  const rect = progressBar.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  const pct = x / rect.width;
  if (audio.duration) {
    audio.currentTime = pct * audio.duration;
  }
  progressFilled.style.width = (pct * 100) + "%";
  progressThumb.style.left   = (pct * 100) + "%";
  currentTimeEl.textContent  = formatTime(pct * (audio.duration || 0));
}

progressBar.addEventListener("mousedown", (e) => {
  isDraggingProgress = true;
  seekTo(e);
});
document.addEventListener("mousemove", (e) => {
  if (isDraggingProgress) seekTo(e);
});
document.addEventListener("mouseup", () => {
  isDraggingProgress = false;
});

// Touch support for progress
progressBar.addEventListener("touchstart", (e) => {
  isDraggingProgress = true;
  seekTo(e.touches[0]);
}, { passive: true });
document.addEventListener("touchmove", (e) => {
  if (isDraggingProgress) seekTo(e.touches[0]);
}, { passive: true });
document.addEventListener("touchend", () => {
  isDraggingProgress = false;
});

// ──────────────────────────────────────────────────────
//  VOLUME
// ──────────────────────────────────────────────────────
function setVolume(e) {
  const rect = volumeBar.getBoundingClientRect();
  const x    = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  volume = x / rect.width;
  audio.volume  = volume;
  isMuted = volume === 0;
  volumeFilled.style.width = (volume * 100) + "%";
  volumeThumb.style.left   = (volume * 100) + "%";
  updateMuteUI();
}

volumeBar.addEventListener("mousedown", (e) => {
  isDraggingVolume = true;
  setVolume(e);
});
document.addEventListener("mousemove", (e) => {
  if (isDraggingVolume) setVolume(e);
});
document.addEventListener("mouseup", () => {
  isDraggingVolume = false;
});

function updateMuteUI() {
  iconVol.style.display  = isMuted ? "none"   : "inline";
  iconMute.style.display = isMuted ? "inline" : "none";
}

muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  audio.muted = isMuted;
  updateMuteUI();
});

// ──────────────────────────────────────────────────────
//  CONTROL BUTTONS
// ──────────────────────────────────────────────────────
playPauseBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevTrack);
nextBtn.addEventListener("click", nextTrack);

heroPlayBtn.addEventListener("click", () => {
  if (currentIndex === -1) loadAndPlay(0);
  else togglePlay();
});

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
  shuffleBtn.title = isShuffle ? "Shuffle: On" : "Shuffle: Off";
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
  repeatBtn.title = isRepeat ? "Repeat: On" : "Repeat: Off";
});

likeBtn.addEventListener("click", () => {
  likeBtn.classList.toggle("liked");
  likeBtn.textContent = likeBtn.classList.contains("liked") ? "♥" : "♡";
});

// ──────────────────────────────────────────────────────
//  KEYBOARD SHORTCUTS
// ──────────────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
  const tag = document.activeElement.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea") return;

  switch (e.code) {
    case "Space":
      e.preventDefault();
      togglePlay();
      break;
    case "ArrowRight":
      e.preventDefault();
      if (audio.duration) audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
      break;
    case "ArrowLeft":
      e.preventDefault();
      audio.currentTime = Math.max(audio.currentTime - 5, 0);
      break;
    case "ArrowUp":
      e.preventDefault();
      volume = Math.min(volume + 0.1, 1);
      audio.volume = volume;
      volumeFilled.style.width = (volume * 100) + "%";
      volumeThumb.style.left   = (volume * 100) + "%";
      break;
    case "ArrowDown":
      e.preventDefault();
      volume = Math.max(volume - 0.1, 0);
      audio.volume = volume;
      volumeFilled.style.width = (volume * 100) + "%";
      volumeThumb.style.left   = (volume * 100) + "%";
      break;
    case "KeyN":
      nextTrack();
      break;
    case "KeyP":
      prevTrack();
      break;
  }
});

// ──────────────────────────────────────────────────────
//  SEARCH
// ──────────────────────────────────────────────────────
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) {
    filteredSongs = [...songs];
  } else {
    filteredSongs = songs.filter(s =>
      s.title.toLowerCase().includes(q)  ||
      s.artist.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q)  ||
      s.genre.toLowerCase().includes(q)
    );
  }
  songCountEl.textContent = `${filteredSongs.length} tracks`;

  // Keep current song active if still in filtered list
  if (currentIndex !== -1) {
    const activeSong = songs[currentIndex] || null;
    if (activeSong) {
      const newIdx = filteredSongs.findIndex(s => s.id === activeSong.id);
      currentIndex = newIdx; // -1 if not in filtered
    }
  }

  renderGrid(filteredSongs);
  renderPlaylist(filteredSongs);
});

// ──────────────────────────────────────────────────────
//  SIDEBAR TOGGLE (MOBILE)
// ──────────────────────────────────────────────────────
menuBtn.addEventListener("click", () => {
  sidebar.classList.add("open");
  sidebarOverlay.classList.add("open");
});

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("open");
}
sidebarClose.addEventListener("click", closeSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);

// ──────────────────────────────────────────────────────
//  AUDIO EVENTS
// ──────────────────────────────────────────────────────
audio.addEventListener("play", () => {
  isPlaying = true;
  updatePlayPauseUI(true);
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  updatePlayPauseUI(false);
});

audio.addEventListener("error", () => {
  // File not found — update UI but don't crash
  console.warn(`Could not load: ${audio.src}`);
  playerTitle.textContent  = filteredSongs[currentIndex]?.title || "—";
  playerArtist.textContent = "(file not found — add mp3 to /music folder)";
});

// ──────────────────────────────────────────────────────
//  BOOT
// ──────────────────────────────────────────────────────
init();
