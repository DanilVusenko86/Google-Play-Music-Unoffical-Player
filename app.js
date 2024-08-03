document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const backbtn = document.getElementById('back');
    const playlistbtn = document.getElementById('miniplaylist');
    const upbtn = document.getElementById('Muspan');
    const playbtn = document.getElementById('play');
    const toggleBtn = document.getElementById('togglebtn');
    const thumbnail = document.getElementById('thumbnail');
    const musicName = document.getElementById('musicName');
    const artistName = document.getElementById('artistName');
    const uploadFolder = document.getElementById('uploadFolder');
    const albums = document.getElementById('albums');
    const tracks = document.getElementById('tracks');
    const miniTracks = document.getElementById('minitracks');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressDot = document.getElementById('progressDot');
    const albumTitle = document.getElementById('albumTitle');
    const albumTitlee = document.getElementById('albumTitlee');
    const albumList = document.querySelector('.album-list');
    const trackList = document.querySelector('.track-list');
    const mainPanel = document.querySelector('.panel');
    const playlistPanel = document.querySelector('.mini-playlist');
    


    let albumData = JSON.parse(localStorage.getItem('albumData')) || {};
    let currentAlbum = null;
    let currentIndex = 0;

    uploadFolder.addEventListener('change', (event) => {
        const files = event.target.files;
        const albumName = files[0].webkitRelativePath.split('/')[0];
        albumData[albumName] = [];
        Array.from(files).forEach(file => {
            const url = URL.createObjectURL(file);
            const song = {
                file: file,
                url: url,
                title: 'Unknown Name',
                artist: 'Unknown Artist',
                thumbnail: 'noalbum.png'
            };

            jsmediatags.read(file, {
                onSuccess: (tag) => {
                    const tags = tag.tags;
                    song.title = tags.title || 'Unknown Name';
                    song.artist = tags.artist || 'Unknown Artist';

                    if (tags.picture) {
                        let base64String = "";
                        for (let i = 0; i < tags.picture.data.length; i++) {
                            base64String += String.fromCharCode(tags.picture.data[i]);
                        }
                        song.thumbnail = "data:" + tags.picture.format + ";base64," + window.btoa(base64String);
                    }

                    if (albumData[albumName].length === 0) {
                        albumData[albumName].thumbnail = song.thumbnail;
                        albumData[albumName].artist = song.artist;
                    }

                    albumData[albumName].push(song);
                    saveAlbumData();
                    updateAlbumList();
                },
                onError: (error) => {
                    console.log(error);
                }
            });
        });
    });

    function saveAlbumData() {
        localStorage.setItem('albumData', JSON.stringify(albumData));
    }

    function updateAlbumList() {
        albums.innerHTML = '';
        Object.keys(albumData).forEach(albumName => {
            const li = document.createElement('li');
            li.classList.add('album-item');
            li.onclick = () => {
                openAlbum(albumName);
            };

            const img = document.createElement('img');
            img.src = albumData[albumName][0].thumbnail;
            img.classList.add('album-thumbnail');

            const text = document.createElement('div');
            text.classList.add('album-text');
            text.innerHTML = ` <strong class="album-name">${albumName}</strong>  <p class="album-artist">${albumData[albumName][0].artist}</p>`;

            li.appendChild(img);
            li.appendChild(text);
            albums.appendChild(li);
        });
    }

    function openAlbum(albumName) {
        currentAlbum = albumName;
        albumTitle.textContent = albumName;
        albumTitlee.textContent = albumName;
        trackList.style.display = 'block';
        mainPanel.style.background = `transparent`;
        trackList.style.background = `no-repeat url("${albumData[albumName][0].thumbnail}")`;
        trackList.style.backgroundSize = `100%`;
        albumList.style.display = 'none';
        updateTrackList();
        updateMiniPlayList();
    }

    function updateTrackList() {
        tracks.innerHTML = '';
        albumData[currentAlbum].forEach((song, index) => {
            const li = document.createElement('li');
            li.classList.add('track-item');
            li.onclick = () => {
                loadSong(index);
            };
    const img = document.createElement('img');
            img.src = song.thumbnail;
            img.classList.add('track-thumbnail');

            const text = document.createElement('div');
            text.innerHTML = `  <strong>${song.title}</strong><br>  ${song.artist}`;

            li.appendChild(img);
            li.appendChild(text);
            tracks.appendChild(li);
        });
    }
    function updateMiniPlayList() {
        miniTracks.innerHTML = '';
        albumData[currentAlbum].forEach((song, index) => {
            const li = document.createElement('li');
            li.classList.add('track-item');
            li.onclick = () => {
                loadSong(index);
            };
    const img = document.createElement('img');
            img.src = song.thumbnail;
            img.classList.add('track-thumbnail');

            const text = document.createElement('div');
            text.innerHTML = `  <strong>${song.title}</strong><br>  ${song.artist}`;

            li.appendChild(img);
            li.appendChild(text);
            miniTracks.appendChild(li);
        });
    }

    function loadSong(index) {
        const song = albumData[currentAlbum][index];
        audio.src = song.url;
        thumbnail.src = song.thumbnail;
        musicName.textContent = `${song.title}`;
        artistName.textContent = `${song.artist}`;
        currentIndex = index;
    }

    function nextSong() {
        currentIndex = (currentIndex + 1) % albumData[currentAlbum].length;
        loadSong(currentIndex);
    }

    function prevSong() {
        currentIndex = (currentIndex - 1 + albumData[currentAlbum].length) % albumData[currentAlbum].length;
        loadSong(currentIndex);
    }

    function toggleMute() {
        audio.muted = !audio.muted;
    }

    function backToAlbums() {
        trackList.style.display = 'none';
        albumList.style.display = 'block';
        mainPanel.style.background = `#ef6d00`;
    }
    function miniPlaylistView() {
        const styles = getComputedStyle(playlistPanel)
        const displayStyle = styles.display;
        if(displayStyle === "none"){
            playlistPanel.style.display = "block";
            playlistbtn.style.background = `no-repeat url('playlistPressed.png')`;
            playlistbtn.style.backgroundSize = '28px';
        }else {
            playlistPanel.style.display = "none";
            playlistbtn.style.background = `no-repeat url('playlist.png')`;
            playlistbtn.style.backgroundSize = '28px';
        }  
    }
    playlistbtn.addEventListener('click', miniPlaylistView)
        audio.addEventListener('ended', () => {
            nextSong();
        });

    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
        progressDot.style.left = `${progress}%`;
    });

    progressContainer.addEventListener('click', (event) => {
        const width = progressContainer.clientWidth;
        const clickX = event.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    });

    // Load album data from localStorage when the page is loaded
    updateAlbumList();

    // Update the function to open the mini player window
miniPlayerButton.addEventListener('click', () => {
    const miniPlayerWindow = window.open('', 'miniPlayer', 'width=300,height=476');
    miniPlayerWindow.document.write(`
        <html>
            <head>
                <title>Mini Player</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; }
                    #playerIcon {position: absolute; left: 5px; top: 10px;}
                    #miniThumbnail { width: 100%; height: auto; position: absolute; left: 0; top: 15%; z-index: 1; right: 0;}
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
    miniPlayerWindow.audio = audio; // Sync the audio element

});

// Ensure global functions are accessible
window.prevSong = function() {
    if (currentIndex > 0) {
        playSong(currentIndex - 1);
    }
};

window.nextSong = function() {
    if (currentIndex < albumData[currentAlbum].length - 1) {
        playSong(currentIndex + 1);
    }
};

window.toggleMute = function() {
    audio.muted = !audio.muted;
};

// Play and Pause functions to ensure they're accessible
const playbtnn = window.document.getElementById('playbtn');
window.playAudio = function() {
    if(audio.paused){
            audio.play();
            playbtnn.innerHTML = `<center><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="mr-2 transition-all ease-in duration-300">
            <path fill="currentColor" d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z"/>
        </svg></center>`
    } else {
        audio.pause();
        playbtnn.innerHTML = `<center><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="group-hover:mr-2 group-focus:mr-2 transition-all ease-in duration-300">
        <path fill="currentColor" d="M9.525 18.025q-.5.325-1.012.038T8 17.175V6.825q0-.6.513-.888t1.012.038l8.15 5.175q.45.3.45.85t-.45.85l-8.15 5.175Z" />
        </svg></center>`
    }
};

// Ensure playSong is globally accessible
window.playSong = function(index) {
    currentIndex = index;
    const song = albumData[currentAlbum][index];
    if (!song || !song.file) {
        console.error('Invalid song data', song);
        return;
    }
    audio.src = URL.createObjectURL(song.file);
    audio.play();

    // Update UI elements
    thumbnail.src = song.thumbnail || 'placeholder-thumbnail.jpg';
    musicName.textContent = song.name || 'Unknown Title';
    artistName.textContent = song.artist || 'Unknown Artist';

    // Update mini player if open
    if (miniPlayerWindow && !miniPlayerWindow.closed) {
        const miniThumbnail = miniPlayerWindow.document.getElementById('miniThumbnail');
        const miniMusicName = miniPlayerWindow.document.getElementById('miniMusicName');
        const miniArtistName = miniPlayerWindow.document.getElementById('miniArtistName');
        if (miniThumbnail && miniMusicName && miniArtistName) {
            miniThumbnail.src = thumbnail.src;
            miniMusicName.textContent = musicName.textContent;
            miniArtistName.textContent = artistName.textContent;
        }
    }
};

// Additional check to ensure audio element is ready
window.onload = function() {
    if (audio) {
        audio.addEventListener('loadedmetadata', () => {
            const progressContainer = document.getElementById('progressContainer');
            if (progressContainer) {
                progressContainer.addEventListener('click', function(e) {
                    const width = this.clientWidth;
                    const clickX = e.offsetX;
                    const duration = audio.duration;
                    audio.currentTime = (clickX / width) * duration;
                });
            }
        });
    }
};

// Ensure progress click works in mini player
if (typeof miniPlayerWindow !== 'undefined') {
    miniPlayerWindow.document.querySelector('.progress-container').addEventListener('click', (e) => {
        const width = miniPlayerWindow.document.querySelector('.progress-container').clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;

        audio.currentTime = (clickX / width) * duration;
    });
}


    window.nextSong = nextSong;
    window.prevSong = prevSong;
    window.toggleMute = toggleMute;
    window.backToAlbums = backToAlbums;

    backbtn.addEventListener('click', function (e) {
        var div3 = document.getElementById('upload')
        div3.style.display = div3.style.display === 'none' ? 'flex' : 'none'
    });
    upbtn.addEventListener('click', function (e) {
        var div2 = document.getElementById('upload')
        div2.style.display = div2.style.display === 'flex' ? 'none' : 'flex'
    })
    playbtn.addEventListener("click", function(){
        if(audio.paused){
            audio.play();
            playbtn.innerHTML = `<center><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="mr-2 transition-all ease-in duration-300">
            <path fill="currentColor" d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z"/>
        </svg></center>`
    } else {
        audio.pause();
        playbtn.innerHTML = `<center><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="group-hover:mr-2 group-focus:mr-2 transition-all ease-in duration-300">
        <path fill="currentColor" d="M9.525 18.025q-.5.325-1.012.038T8 17.175V6.825q0-.6.513-.888t1.012.038l8.15 5.175q.45.3.45.85t-.45.85l-8.15 5.175Z" />
        </svg></center>`
    }
   });
});
