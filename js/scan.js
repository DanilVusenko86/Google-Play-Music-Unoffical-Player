// Fetch album data from JSON
fetch('json/music.json')
  .then(response => response.json())
  .then(albums => {
    displayAlbums(albums);
  })
  .catch(err => console.error('Error loading albums:', err));


let clicked = false;
let muted = false;
let currentAlbum = null;
let isRepeating = false;
export let isShuffling = false; 
let currentTrackIndex = -1;
const audioPlayer = document.getElementById('audio');


// Function to create and display albums
function displayAlbums(albums) {
  const allTracksList = document.getElementById('AllTracks');
  allTracksList.innerHTML = ''; // Clear previous content if any

  albums.forEach(album => {
    album.tracks.forEach((track, index) => {
      const trackDiv = document.createElement('div');
      trackDiv.className = 'track';
      trackDiv.innerHTML = `
        <img src="${album.cover}" class="track-cover" id="cover">
        <div class="equalizer" style="display="none"></div>
        <div class="text-box">
          <h1 class="album-name">${track.title}</h1>
          <p class="album-artist">${album.artist}</p>
        </div>
      `;

      trackDiv.onclick = () => {
        startPlayer(album.cover, track.path, track.title, album.artist, index, album);

        // Hide all equalizers and show the cover for other tracks
        document.querySelectorAll('.track').forEach(t => {
          t.querySelector('.track-cover').style.display = 'block';
          t.querySelector('.equalizer').style.display = 'none';
        });

        // Hide the cover and show the equalizer for the clicked track
        const cover = trackDiv.querySelector('.track-cover');
        const equalizer = trackDiv.querySelector('.equalizer');

        cover.style.display = 'none';
        equalizer.style.display = 'flex';

        // Add equalizer bars
        equalizer.innerHTML = `
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        `;
      };

      allTracksList.appendChild(trackDiv);
    });
  });

  const container = document.getElementById('albumList');
  albums.forEach(album => {
    const albumDiv = document.createElement('div');
    albumDiv.className = 'album-item z-depth-1';
    albumDiv.innerHTML = `
      <img src="${album.cover}" alt="Album Cover" class="album-cover">
      <div class="album-text">
        <h1 class="album-name">${album.name}</h1>
        <p class="album-artist">${album.artist}</p>
      </div>
    `;

    albumDiv.onclick = () => {
      const trackList = document.getElementById('AlbumTracks');
      const trackListPanel = document.getElementById('openedAlbum');
      const naviPanel = document.getElementById('navigation');

      document.getElementById('AlbumName').textContent = album.name;
      document.getElementById('AlbumArtist').textContent = album.artist;

      document.getElementById('MiniName').textContent = album.name;
      document.getElementById('MiniArtist').textContent = album.artist;

      document.getElementById('songsCover').src = album.cover;

      document.getElementById('MiniCover').style.backgroundImage = `linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(255,255,255,0) 100%), url(${album.cover})`;

      trackListPanel.style.backgroundImage = `url(${album.cover})`;
      trackListPanel.style.display = `flex`;
      naviPanel.style.backgroundColor = '';
      naviPanel.style.background = 'linear-gradient(180deg, rgba(0,0,0,0.8800770308123249) 0%, rgba(255,255,255,0) 100%)';

      container.style.display = 'none';

      trackList.innerHTML = ''; // Clear existing track list
      document.getElementById('miniAllTracks').innerHTML = '';

      album.tracks.forEach((track, index) => {
        const trackDiv = document.createElement('div');
        trackDiv.className = 'track';
        trackDiv.innerHTML = `
          <div class="equalizer"></div>
          <div class="text-box">
            <h1 class="album-name">${track.title}</h1>
            <p class="album-artist">${album.artist}</p>
          </div>
        `;

        const MinitrackDiv = document.createElement('div');
        MinitrackDiv.className = 'track';
        MinitrackDiv.innerHTML = `
          <div class="equalizer"></div>
          <div class="text-box">
            <h1 class="album-name">${track.title}</h1>
            <p class="album-artist">${album.artist}</p>
          </div>
        `;

        trackDiv.onclick = () => {
          const allEqualizers = document.querySelectorAll('.equalizer');
          allEqualizers.forEach(eq => eq.innerHTML = ''); // Clear existing equalizer bars

          const threebars = trackDiv.querySelector('.equalizer');
          threebars.innerHTML = `
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
          `;

          startPlayer(album.cover, track.path, track.title, album.artist, index, album);
        };

        MinitrackDiv.onclick = () => {
          const allEqualizers = document.querySelectorAll('.equalizer');
          allEqualizers.forEach(eq => eq.innerHTML = ''); // Clear existing equalizer bars
        
          const threebars = MinitrackDiv.querySelector('.equalizer'); // Correct reference
          threebars.innerHTML = `
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
          `;
        
          startPlayer(album.cover, track.path, track.title, album.artist, index, album);
        };
        
        /*document.getElementById('miniplayer').addEventListener('click', () => {
          const miniPlayerWindow = window.open('', `${track.title}`, 'width=300,height=300,resizable=no,autoHideMenuBar=true');
          miniPlayerWindow.document.write(`
              <html>
                  <head>
                      <title>Mini Player</title>
                      <style>
                          body { font-family: Arial, sans-serif; text-align: center; }
                          #playerIcon {position: absolute; left: 5px; top: 10px;}
                          .controls { display: flex; justify-content: center; align-items: center; }
                          .progress-container { width: 100%; cursor: pointer; background: #ddd; bottom: 60px; position: absolute; left: 0;}
                          .progress-bar { width: 0%; height: 5px; background: #d97f3e;}
                          .progress-dot { width: 10px; height: 10px; background: #d97f3e; border-radius: 50%; position: absolute; top: 2px; transform: translate(-50%, -50%); }
                          .nameTags {width: 100%; height: 5%; background: white; position: absolute; top: 0; left: 0;}
                          .playerConteiner {width: 100%; height: 5%; background: white; position: absolute; bottom: 0; left: 0; z-index: 3000;}
                          #miniMusicName { position: absolute; left: 50px; top: -5px; font-size: 17px;}
                          #miniArtistName { position: absolute; left: 50px; top: 15px; font-size: 14px; color: #898b88;}
                          #playbtn { display: flex; justify-content: center; aligin-items: center; width: 30px; height: 30px; background: transparent; background-size: 30px; border: none; position: absolute; bottom: 30px; color: black; left: 45%; }
                          svg { width: 50px; height: 50px; background-size: 50px; border: none; color: black; }
                          #prevbtn { background-image: url("prev.png"); background-size: 30px; background-color: transparent; width: 30px; height: 30px; border: none; position: absolute; bottom: 20px; color: white; left: 15%; }
                          #nextbtn { background-image: url("next.png"); background-size: 30px; background-color: transparent; width: 30px; height: 30px; border: none; position: absolute; bottom: 20px; color: white; right: 15%; }
                      </style>
                  </head>
                  <body>
                      <div>
                          
                          <div class="nameTags">
                              <img id="playerIcon" src="icon.webp" width="35px">
                              <h3 id="miniMusicName">${musicName.textContent}</h3>
                              <p id="miniArtistName">${artistName.textContent}</p>
                          </div>
                          <img id="miniThumbnail" src="${thumbnail.src}" alt="Thumbnail">
                          <div class="playerConteiner">
                              <div class="progress-container">
                                  <div class="progress-bar" id="miniProgressBar"></div>
                                  <div class="progress-dot" id="miniProgressDot"></div>
                              </div>
                              <div class="controls">
                                  <button id="prevbtn" onclick="window.opener.prevSong()"></button>
                                  <button id="playbtn" onclick="window.opener.playAudio()"><center><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="group-hover:mr-2 group-focus:mr-2 transition-all ease-in duration-300">
                                  <path fill="currentColor" d="M9.525 18.025q-.5.325-1.012.038T8 17.175V6.825q0-.6.513-.888t1.012.038l8.15 5.175q.45.3.45.85t-.45.85l-8.15 5.175Z" />
                                  </svg></center></button>
                                  <button id="nextbtn" onclick="window.opener.nextSong()"></button>
                              </div>
                          </div>
                      </div>
                    <script>
                          function updateMiniPlayerProgress() {
                              const audio = window.opener.audio;
                              if (audio && audio.duration) {
                                  const progressPercent = (audio.currentTime / audio.duration) * 100;
                                  document.getElementById('miniProgressBar').style.width = progressPercent + '%';
                                  document.getElementById('miniProgressDot').style.left = progressPercent + '%';
                              }
                          }
        
                          function attachMiniPlayerListeners() {
                              const progressContainer = document.getElementById('miniProgressContainer');
                              if (progressContainer) {
                                  progressContainer.addEventListener('click', function(e) {
                                      const width = this.clientWidth;
                                      const clickX = e.offsetX;
                                      const duration = window.opener.audio.duration;
                                      window.opener.audio.currentTime = (clickX / width) * duration;
                                  });
                              }
                              
                              setInterval(updateMiniPlayerProgress, 500);
                          }
        
                          window.onload = attachMiniPlayerListeners;
                      </script>
                  </body>
              </html>
          `);
          miniPlayerWindow.document.close();
        });*/

        trackList.append(trackDiv);
        document.getElementById('miniAllTracks').append(MinitrackDiv);
      });
    };

    container.appendChild(albumDiv);
  });
}

const playBTN = document.getElementById('play');

playBTN.addEventListener('click', () => {
  if (!clicked) {
    audioPlayer.play();
    clicked = true;
    document.getElementById('playICon').textContent = 'pause';
  } else {
    audioPlayer.pause();
    clicked = false;
    document.getElementById('playICon').textContent = 'play_arrow';
  }
});

document.addEventListener('keydown', function(event) {
  if (event.code === 'Space') {
    if (!clicked) {
      audioPlayer.play();
      clicked = true;
      document.getElementById('playICon').textContent = 'pause';
    } else {
      audioPlayer.pause();
      clicked = false;
      document.getElementById('playICon').textContent = 'play_arrow';
    }
  }
});

function startPlayer(cover, trackPath, name, artist, trackIndex, album) {
  clicked = true;

  document.getElementById('playICon').textContent = 'pause';
  document.getElementById('songName').textContent = name;
  document.getElementById('songArtist').textContent = artist;
  document.getElementById('playerCover').src = cover;

  audioPlayer.src = trackPath;
  audioPlayer.play();

  // Update current track and album info
  currentAlbum = album;
  currentTrackIndex = trackIndex;

  audioPlayer.addEventListener('timeupdate', updateProgressBar);
}

document.getElementById('playFirst').addEventListener('click', () => {
  if (currentAlbum && currentAlbum.tracks.length > 0) {
    // Start playing the first track in the current album
    startPlayer(
      currentAlbum.cover, 
      currentAlbum.tracks[0].path, 
      currentAlbum.tracks[0].title, 
      currentAlbum.artist, 
      0, // First track index
      currentAlbum
    );
  } else {
    console.error(`No album or tracks available to play: ${currentAlbum}`);
  }
});

// Add event listeners for Next and Previous buttons
document.getElementById('nextbtn').addEventListener('click', playNextTrack);
document.getElementById('prevbtn').addEventListener('click', playPreviousTrack);

function playNextTrack() {
  if (!currentAlbum || currentTrackIndex === -1) return;

  if (isShuffling) {
    // Randomly pick a new track index
    currentTrackIndex = Math.floor(Math.random() * currentAlbum.tracks.length);
  } else {
    // Play the next track sequentially
    currentTrackIndex = (currentTrackIndex + 1) % currentAlbum.tracks.length;
  }

  const nextTrack = currentAlbum.tracks[currentTrackIndex];
  startPlayer(currentAlbum.cover, nextTrack.path, nextTrack.title, currentAlbum.artist, currentTrackIndex, currentAlbum);
}

function playPreviousTrack() {
  if (!currentAlbum || currentTrackIndex === -1) return;

  if (isShuffling) {
    // Randomly pick a previous track index
    currentTrackIndex = Math.floor(Math.random() * currentAlbum.tracks.length);
  } else {
    // Play the previous track sequentially
    currentTrackIndex = (currentTrackIndex - 1 + currentAlbum.tracks.length) % currentAlbum.tracks.length;
  }

  const prevTrack = currentAlbum.tracks[currentTrackIndex];
  startPlayer(currentAlbum.cover, prevTrack.path, prevTrack.title, currentAlbum.artist, currentTrackIndex, currentAlbum);
}


const muteBTN = document.getElementById('mutebtn');
muteBTN.addEventListener('click', () => {
  if (!muted) {
    audioPlayer.muted = true;
    muted = true;
    document.getElementById('muteIcon').textContent = 'volume_off';
  } else {
    audioPlayer.muted = false;
    muted = false;
    document.getElementById('muteIcon').textContent = 'volume_up';
  }
});

// Shuffle button functionality
const shuffleBTN = document.getElementById('shuffle');
shuffleBTN.addEventListener('click', () => {
  isShuffling = !isShuffling; // Toggle shuffle state
  document.getElementById('shuffleIcon').style.color = isShuffling ? `#ef6c00` : 'black'; // Change the icon
});

const repeatBTN = document.getElementById('repeat');
repeatBTN.addEventListener('click', () => {
  isRepeating = !isRepeating;
  document.getElementById('repeatIcon').textContent = isRepeating ? 'repeat_one' : 'repeat';
});

// Ensure the track repeats when it ends
audioPlayer.addEventListener('ended', () => {
  if (isRepeating) {
    startPlayer(
      currentAlbum.cover,
      currentAlbum.tracks[currentTrackIndex].path,
      currentAlbum.tracks[currentTrackIndex].title,
      currentAlbum.artist,
      currentTrackIndex,
      currentAlbum
    );
  } else {
    playNextTrack(); // Move to the next track if not repeating
  }
});

// Progress bar logic
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');

progressContainer.addEventListener('mousedown', startDrag);
progressContainer.addEventListener('mousemove', dragProgress);
progressContainer.addEventListener('mouseup', endDrag);

let isDragging = false;

function updateProgressBar() {
  if (!isDragging) {
    const { currentTime, duration } = audioPlayer;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }
}

function setProgress(e) {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audioPlayer.duration;

  audioPlayer.currentTime = (clickX / width) * duration;
}

function startDrag(e) {
  isDragging = true;
  setProgress(e);
}

function dragProgress(e) {
  if (isDragging) {
    setProgress(e);
  }
}

function endDrag() {
  isDragging = false;
}


