const coverImg = document.querySelector('.album-cover');
const title = document.querySelector('.title');
const artist = document.querySelector('.artist');
const audioFile = document.querySelector('.audio');
const playPauseBtn = document.querySelector('.play-pause-btn');
const playPauseIcon = playPauseBtn.querySelector('svg').querySelector('use');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');

let isPlay = false;
let currentSong = 0;

const initSong = (i) => {
  coverImg.src = songs[i].cover;
  coverImg.alt = songs[i].artist + ' album cover';
  title.textContent = songs[i].title;
  artist.textContent = songs[i].artist;
  audioFile.src = songs[i].audio;
  audioFile.currentTime = 0;
  document.documentElement.style.setProperty('--primary-color', songs[i].color1);
  document.documentElement.style.setProperty('--secondary-color', songs[i].color2);
}

initSong(currentSong);

const playPause = () => {
  if (!isPlay) {
    audioFile.play();
    playPauseIcon.setAttribute("href", "assets/svg/icons.svg#pause");
    isPlay = true;
  } else {
    audioFile.pause();
    playPauseIcon.setAttribute("href", "assets/svg/icons.svg#play");
    isPlay = false;
  }
}

playPauseBtn.addEventListener("click", playPause);

const nextTrack = () => {
  if (currentSong >= songs.length - 1) {
    currentSong = 0;
  } else {
    currentSong += 1;
  }
  initSong(currentSong);
}

const prevTrack = () => {
  if (currentSong <= 0) {
    currentSong = songs.length - 1;
  } else {
    currentSong -= 1;
  }
  initSong(currentSong);
}

nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

