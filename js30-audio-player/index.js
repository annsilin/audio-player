const coverImg = document.querySelector('.album-cover');
const title = document.querySelector('.title');
const artist = document.querySelector('.artist');
const audioFile = document.querySelector('.audio');
const playPauseBtn = document.querySelector('.play-pause-btn');
const playPauseIcon = playPauseBtn.querySelector('svg').querySelector('use');

let isPlay = false;

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
