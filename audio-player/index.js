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
const volumeBar = document.querySelector('.volume-bar');
const volumeBarCurrent = document.querySelector('.volume-bar__inner');
const volumeBtn = document.getElementById('volume-toggle');
const volumeBtnIcon = volumeBtn.querySelector('svg').querySelector('use');
const volumeBarContainer = document.querySelector('.volume-wrapper');
const volumeUpBtn = document.getElementById('volume-up-btn');
const volumeDownBtn = document.getElementById('volume-down-btn');

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
}

/* Pause song */
const pause = () => {
  audioFile.pause();
  playPauseIcon.setAttribute("href", "assets/svg/icons.svg#play");
}

/* Play or pause song */
const playPause = () => {
  if (audioFile.paused) {
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
const startDragProgress = () => {
  isDraggingProgress = true;
  progressBar.addEventListener("mousemove", dragTrack);
  progressBar.addEventListener("mouseup", stopDragProgress);
  progressBar.addEventListener("mouseleave", stopDragProgress);
};

/* Stop dragging progress bar handle */
const stopDragProgress = () => {
  setTimeout(function () {
    isDraggingProgress = false;
    progressBar.removeEventListener("mousemove", dragTrack);
    progressBar.removeEventListener("mouseup", stopDragProgress);
    progressBar.removeEventListener("mouseleave", stopDragProgress);
  }, 50)
};

/* Drag progress bar handle */
const dragTrack = (e) => {
  if (isDraggingProgress) {
    e.preventDefault();
    const length = progressBar.offsetWidth;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const duration = audioFile.duration;
    audioFile.currentTime = clickX / length * duration;
  }
};

/* Update volume bar width upon current audio volume */
const volumeBarUpdate = () => {
  const volume = audioFile.volume;
  const volumeBarPercent = volume * 100;
  volumeBarCurrent.style.width = `${volumeBarPercent}%`;
};

/* Set volume when user clicks on volume bar */
const setVolume = (e) => {
  const length = volumeBar.offsetWidth;
  const clickX = e.offsetX;
  audioFile.volume = clickX / length;
};

/* Drag volume bar handle */
const dragVolume = (e) => {
  if (isDraggingVolume) {
    e.stopPropagation()
    const length = volumeBar.offsetWidth;
    const clickX = e.clientX - volumeBar.getBoundingClientRect().left;
    audioFile.volume = clickX / length;
  }
};

/* Start dragging volume bar handle */
const startDragVolume = () => {
  isDraggingVolume = true;
  volumeBar.addEventListener("mousemove", dragVolume);
  volumeBar.addEventListener("mouseup", stopDragVolume);
  volumeBar.addEventListener("mouseleave", stopDragVolume);
};

/* Stop dragging volume bar handle */
const stopDragVolume = () => {
  setTimeout(function () {
    isDraggingVolume = false;
    volumeBar.removeEventListener("mousemove", dragVolume);
    volumeBar.removeEventListener("mouseup", stopDragVolume);
    volumeBar.removeEventListener("mouseleave", stopDragVolume);
  }, 50)
};

/* Initialize player */
let currentSong = 0;
let isDraggingProgress = false;
let isDraggingVolume = false;
audioFile.volume = 0.5;

initSong(currentSong);
volumeBarUpdate();

playPauseBtn.addEventListener("click", playPause);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);
/* When track ends switch to next one automatically */
audioFile.addEventListener("ended", nextTrack);
/* Update progress bar while track is playing */
audioFile.addEventListener("timeupdate", progressBarUpdate);
progressBar.addEventListener("click", rewindTrack);
progressBar.addEventListener("mousedown", startDragProgress);
audioFile.addEventListener("volumechange", volumeBarUpdate);
volumeBar.addEventListener("click", setVolume);
volumeBar.addEventListener("mousedown", startDragVolume);

volumeBtn.addEventListener("click", () => {
  volumeBarContainer.classList.toggle("volume-visible");
  if (volumeBarContainer.classList.contains("volume-visible")) {
    volumeBtnIcon.setAttribute("href", "assets/svg/icons.svg#cross");
  } else {
    volumeBtnIcon.setAttribute("href", "assets/svg/icons.svg#volume-up");
  }
});

volumeUpBtn.addEventListener("click", () => {
  if (audioFile.volume < 1) {
    let volume = audioFile.volume + 0.1;
    if (volume >= 1) {
      audioFile.volume = 1;
    } else {
      audioFile.volume = volume;
    }
  }
});

volumeDownBtn.addEventListener("click", () => {
  if (audioFile.volume > 0) {
    let volume = audioFile.volume - 0.1;
    if (volume <= 0) {
      audioFile.volume = 0;
    } else {
      audioFile.volume = volume;
    }
  }
});

document.addEventListener("click", (e) => {
  if (!volumeBarContainer.contains(e.target) && !volumeBtn.contains(e.target)) {
    volumeBarContainer.classList.remove("volume-visible");
    volumeBtnIcon.setAttribute("href", "assets/svg/icons.svg#volume-up");
  }
});
