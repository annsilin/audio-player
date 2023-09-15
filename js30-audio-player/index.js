const coverImg = document.querySelector('.album-cover');
const title = document.querySelector('.title');
const artist = document.querySelector('.artist');
const audioFile = document.querySelector('.audio');
const playPauseBtn = document.querySelector('.play-pause-btn');
const playPauseIcon = playPauseBtn.querySelector('svg').querySelector('use');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const progressBar = document.querySelector('.progress-bar');
const progressBarCurrent = document.querySelector('.progress-bar__inner');
const progressBarTime = document.querySelector('.progress-bar-time__current');
const progressBarDuration = document.querySelector('.progress-bar-time__end')

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
  progressBarCurrent.style.width = '0';
}

initSong(currentSong);

const play = () => {
  audioFile.play();
  playPauseIcon.setAttribute("href", "assets/svg/icons.svg#pause");
  isPlay = true;
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

const nextTrack = () => {
  if (currentSong >= songs.length - 1) {
    currentSong = 0;
  } else {
    currentSong += 1;
  }
  initSong(currentSong);
  play();
}

const prevTrack = () => {
  if (currentSong <= 0) {
    currentSong = songs.length - 1;
  } else {
    currentSong -= 1;
  }
  initSong(currentSong);
  play();
}

nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

const convertTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (remainingSeconds < 10) {
    return `${minutes}:0${remainingSeconds}`;
  } else {
    return `${minutes}:${remainingSeconds}`;
  }
}

const progressBarUpdate = (e) => {
  const {duration, currentTime} = e.target;
  const progressBarPercent = currentTime / duration * 100;
  progressBarCurrent.style.width = `${progressBarPercent}%`;
  progressBarTime.textContent = convertTime(currentTime);
}

audioFile.addEventListener("timeupdate", progressBarUpdate);

const rewindTrack = (e) => {
  const length = e.currentTarget.offsetWidth;
  const clickX = e.offsetX;
  const duration = audioFile.duration;

  audioFile.currentTime = clickX / length * duration;
}

progressBar.addEventListener("click", rewindTrack);

audioFile.addEventListener("ended", nextTrack);
