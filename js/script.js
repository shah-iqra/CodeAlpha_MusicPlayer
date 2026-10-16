// 1. Data: প্রতিটা গানের তথ্য একটা object-এ
const songs = [
  { title: "Song One", artist: "Artist One", src: "assets/songs/song1.mp3", cover: "assets/covers/1.jpg" },
  { title: "Song Two", artist: "Artist Two", src: "assets/songs/song2.mp3", cover: "assets/covers/2.jpg" },
  { title: "Song Three", artist: "Artist Three", src: "assets/songs/song3.mp3", cover: "assets/covers/3.jpg" },
];

// 2. DOM elements
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volume = document.getElementById("volume");
const playlistEl = document.getElementById("playlist");

// 3. State
let currentIndex = 0;

// 4. Helpers
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

function loadSong(index) {
  currentIndex = index;
  const song = songs[index];

  audio.src = song.src;
  cover.src = song.cover;
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;

  progress.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";

  highlightPlaylist();
}

function playSong() {
  // Browser autoplay policy-র কারণে play() ব্যর্থ হলে error ধরা
  audio.play().catch(() => {});
}

function pauseSong() {
  audio.pause();
}

function togglePlay() {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
}

function nextSong() {
  loadSong((currentIndex + 1) % songs.length);
  playSong();
}

function prevSong() {
  // গান ৩ সেকেন্ডের বেশি চললে আগে শুরুতে ফিরবে, তারপর আরেকবার চাপলে আগের গান
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  loadSong((currentIndex - 1 + songs.length) % songs.length);
  playSong();
}

function updatePlayButton() {
  playBtn.textContent = audio.paused ? "▶" : "⏸";
}

// 5. Playlist
function buildPlaylist() {
  songs.forEach((song, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${song.title} — ${song.artist}`;
    li.addEventListener("click", () => {
      loadSong(i);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

function highlightPlaylist() {
  const items = playlistEl.querySelectorAll("li");
  items.forEach((li, i) => {
    li.classList.toggle("active", i === currentIndex);
  });
}

// 6. Event listeners
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

audio.addEventListener("play", updatePlayButton);
audio.addEventListener("pause", updatePlayButton);
audio.addEventListener("ended", nextSong); // Autoplay

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audio.duration)) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

// Progress bar টানলে গানের সেই জায়গায় যাবে
progress.addEventListener("input", () => {
  if (!Number.isFinite(audio.duration)) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
});

volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

// 7. Init
audio.volume = volume.value;
buildPlaylist();
loadSong(0);