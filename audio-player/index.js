const coverImg = document.querySelector('.album-cover');
const title = document.querySelector('.title');
const artist = document.querySelector('.artist');
const audioFile = document.querySelector('.audio');
const playPauseBtn = document.querySelector('.play-pause-btn');
const playPauseIcon = playPauseBtn.querySelector('svg').querySelector('use');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const progressBar = document.querySelector('.progress-bar');
const progressBarTime = document.querySelector('.progress-bar-time__current');
const progressBarDuration = document.querySelector('.progress-bar-time__end');
const volumeBar = document.querySelector('.volume-bar');
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
  audioFile.addEventListener('loadedmetadata', () => {
    progressBarDuration.textContent = convertTime(audioFile.duration);
  });
  // Reset progress bar visuals
  progressBar.value = 0;
  progressBar.style.background = `linear-gradient(to right, var(--primary-color) ${progressBar.value}%, #74717C ${progressBar.value}%)`;
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
  e.stopPropagation();
  const {duration, currentTime} = e.target;
  // If duration is not NaN and user isn't dragging a progress bar
  if (duration && !isDraggingProgress) {
    progressBarTime.textContent = convertTime(currentTime);
    progressBar.value = (100 * currentTime) / duration;
    progressBar.style.background = `linear-gradient(to right, var(--primary-color) ${progressBar.value}%, #74717C ${progressBar.value}%)`;
  }
};

/* Rewind track */
const rewindTrack = () => {
    const duration = audioFile.duration;
    if (duration) {
      audioFile.currentTime = duration * (progressBar.value / 100);
    }
};

/* Set volume when user clicks on volume bar */
const setVolume = () => {
  audioFile.volume = volumeBar.value / 100;
  volumeBar.style.background = `linear-gradient(to right, var(--primary-color) ${volumeBar.value}%, #74717C ${volumeBar.value}%)`;
};

/* Initialize player */
let currentSong = 0;
let isDraggingProgress = false;
audioFile.volume = 0.5;
setVolume();
initSong(currentSong);

playPauseBtn.addEventListener("click", playPause);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);
/* When track ends switch to next one automatically */
audioFile.addEventListener("ended", nextTrack);
/* Update progress bar while track is playing */
audioFile.addEventListener("timeupdate", progressBarUpdate);
/* When user touches progress bar prevent progressBarUpdate function */
progressBar.addEventListener("mousedown", () => {
  isDraggingProgress = true;
});
progressBar.addEventListener("touchstart", () => {
  isDraggingProgress = true;
});
progressBar.addEventListener("mouseup", () => {
  isDraggingProgress = false;
});
progressBar.addEventListener("touchend", () => {
  isDraggingProgress = false;
});
/* Rewind the track when user clicks a progress bar*/
progressBar.addEventListener("change", rewindTrack);
/* Update progress bar visuals when user drags progress bar */
progressBar.addEventListener("input", () => {
  progressBar.style.background = `linear-gradient(to right, var(--primary-color) ${progressBar.value}%, #74717C ${progressBar.value}%)`;
  progressBarTime.textContent = `${convertTime(audioFile.duration * (progressBar.value / 100))}`;
})
/* Change volume when user clicks/drags volume bar*/
volumeBar.addEventListener("input", setVolume);
/* Open volume bar popup */
volumeBtn.addEventListener("click", () => {
  volumeBarContainer.classList.toggle("volume-visible");
  if (volumeBarContainer.classList.contains("volume-visible")) {
    volumeBtnIcon.setAttribute("href", "assets/svg/icons.svg#cross");
  } else {
    volumeBtnIcon.setAttribute("href", "assets/svg/icons.svg#volume-up");
  }
});
/* Increase volume btn */
volumeUpBtn.addEventListener("click", () => {
  if (audioFile.volume < 1) {
    let volume = audioFile.volume + 0.1;
    volumeBar.value = volume * 100;
    if (volume >= 1) {
      audioFile.volume = 1;
    } else {
      audioFile.volume = volume;
    }
  }
});
/* Decrease volume btn */
volumeDownBtn.addEventListener("click", () => {
  if (audioFile.volume > 0) {
    let volume = audioFile.volume - 0.1;
    volumeBar.value = volume * 100;
    if (volume <= 0) {
      audioFile.volume = 0;
    } else {
      audioFile.volume = volume;
    }
  }
});
/* Close volume bar when clicking outside */
document.addEventListener("click", (e) => {
  if (!volumeBarContainer.contains(e.target) && !volumeBtn.contains(e.target)) {
    volumeBarContainer.classList.remove("volume-visible");
    volumeBtnIcon.setAttribute("href", "assets/svg/icons.svg#volume-up");
  }
});
