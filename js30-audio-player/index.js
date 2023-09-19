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
const progressBarDuration = document.querySelector('.progress-bar-time__end');
const progressBarHandle = document.querySelector('.progress-bar__inner-dot');

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
  audioFile.addEventListener('loadedmetadata', () => {
    progressBarDuration.textContent = convertTime(audioFile.duration);
  });
}

/* Play song */
const play = () => {
  audioFile.play();
  playPauseIcon.setAttribute("href", "assets/svg/icons.svg#pause");
  isPlaying = true;
}

/* Pause song */
const pause = () => {
  audioFile.pause();
  playPauseIcon.setAttribute("href", "assets/svg/icons.svg#play");
  isPlaying = false;
}

/* Play or pause song */
const playPause = () => {
  if (!isPlaying) {
    play();
  } else {
    pause();
  }
}

/* Switch to next track */
const nextTrack = () => {
  if (currentSong >= songs.length - 1) {
    currentSong = 0;
  } else {
    currentSong += 1;
  }
  initSong(currentSong);
  play();
}

/* Switch to previous track */
const prevTrack = () => {
  if (currentSong <= 0) {
    currentSong = songs.length - 1;
  } else {
    currentSong -= 1;
  }
  initSong(currentSong);
  play();
}

/* Convert time from seconds to m:ss format */
const convertTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (remainingSeconds < 10) {
    return `${minutes}:0${remainingSeconds}`;
  } else {
    return `${minutes}:${remainingSeconds}`;
  }
}

/* Update progress bar with current track time */
const progressBarUpdate = (e) => {
  const {duration, currentTime} = e.target;
  const progressBarPercent = currentTime / duration * 100;
  progressBarCurrent.style.width = `${progressBarPercent}%`;
  progressBarTime.textContent = convertTime(currentTime);
}

/* Rewind track */
const rewindTrack = (e) => {
  // Width of target element
  const length = e.currentTarget.offsetWidth;
  // X coordinate of click
  const clickX = e.offsetX;
  const duration = audioFile.duration;

  audioFile.currentTime = clickX / length * duration;
}

/* Start dragging progress bar handle */
const startDrag = () => {
  isDragging = true;
  progressBar.addEventListener("mousemove", dragTrack);
  progressBar.addEventListener("mouseup", stopDrag);
  progressBar.addEventListener("mouseleave", stopDrag);
};

/* Stop dragging progress bar handle */
const stopDrag = () => {
  setTimeout(function () {
    isDragging = false;
    progressBar.removeEventListener("mousemove", dragTrack);
    progressBar.removeEventListener("mouseup", stopDrag);
    progressBar.removeEventListener("mouseleave", stopDrag);
  }, 50)
};

/* Drag progress bar handle */
const dragTrack = (e) => {
  if (isDragging) {
    e.preventDefault();
    const length = progressBar.offsetWidth;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const duration = audioFile.duration;
    audioFile.currentTime = clickX / length * duration;
  }
};

/* Initialize player with the first song paused */
let isPlaying = false;
let currentSong = 0;
let isDragging = false;

initSong(currentSong);

playPauseBtn.addEventListener("click", playPause);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);
/* When track ends switch to next one automatically */
audioFile.addEventListener("ended", nextTrack);
/* Update progress bar while track is playing */
audioFile.addEventListener("timeupdate", progressBarUpdate);
progressBar.addEventListener("click", rewindTrack);
progressBar.addEventListener("mousedown", startDrag);

