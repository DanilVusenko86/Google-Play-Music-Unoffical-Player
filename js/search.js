// Declare albums as a global variable
let albums = [];

// Load the album data from the JSON file
fetch('json/music.json')
  .then(response => response.json())
  .then(data => {
    albums = data;
  })
  .catch(err => console.error('Error loading albums:', err));

  document.body.addEventListener('click', () => {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.style.display = 'none';
  });
  document.getElementById('albumList').addEventListener('click', () => {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.style.display = 'none';
  });
  document.getElementById('trackList').addEventListener('click', () => {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.style.display = 'none';
  });
  document.getElementById('openedAlbum').addEventListener('click', () => {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.style.display = 'none';
  });

// Function to handle search when Enter is pressed
document.getElementById('search').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const query = event.target.value.toLowerCase().trim();
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = ''; // Clear previous results

    if (!query) return;

    // Filter albums and tracks based on the search query
    const matchingAlbums = albums.filter(album => album.name.toLowerCase().includes(query));
    const matchingSongs = [];

    albums.forEach(album => {
      const matchedTracks = album.tracks.filter(track => track.title.toLowerCase().includes(query));
      if (matchedTracks.length > 0) {
        matchingSongs.push(...matchedTracks.map(track => ({ ...track, albumName: album.name })));
      }
    });

    // Display albums if found
    if (matchingAlbums.length > 0) {
      const albumSection = document.createElement('div');
      albumSection.innerHTML = `<h3>Albums</h3>`;
      matchingAlbums.forEach(album => {
        const albumDiv = document.createElement('div');
        albumDiv.className = 'album-item z-depth-1';
        albumDiv.innerHTML = `
        <img src="${album.cover}" alt="Album Cover" class="album-cover">
        <div class="album-text">
            <h1 class="album-name">${album.name}</h1>
            <p class="album-artist">${album.artist}</p>
        </div>
        `;
        albumDiv.onclick = () => showAlbumTracks(album);
        albumSection.appendChild(albumDiv);
      });
      resultsContainer.appendChild(albumSection);
    }

    // Display songs if found
    if (matchingSongs.length > 0) {
      const songSection = document.createElement('div');
      songSection.innerHTML = `<h3>Songs</h3>`;
      matchingSongs.forEach(song => {
        const songDiv = document.createElement('div');
        songDiv.className = 'track';
        songDiv.innerHTML = `${song.title} (from ${song.albumName})`;

        // Get the album for the current song
        const album = albums.find(album => album.name === song.albumName);

        songDiv.onclick = () => startPlayer(album.cover, song.path, song.title, album.artist);

        songSection.appendChild(songDiv);
      });
      resultsContainer.appendChild(songSection);
    }
  }
});

// Function to show album tracks
function showAlbumTracks(album) {
  const container = document.getElementById('album-container');
  container.innerHTML = ''; // Clear existing content
  const trackList = document.createElement('div');
  trackList.className = 'track-list';

  album.tracks.forEach(track => {
    const trackDiv = document.createElement('div');
    trackDiv.className = 'track';
    trackDiv.textContent = track.title;
    trackDiv.onclick = () => startPlayer(album.cover, track.path, track.title, track.artist);
    trackList.appendChild(trackDiv);
  });

  container.appendChild(trackList);
}
function startPlayer(cover, trackPath, name, artist) {
  clicked = true;

  document.getElementById('playICon').textContent = 'pause';
  document.getElementById('songName').textContent = name;
  document.getElementById('songArtist').textContent = artist;
  document.getElementById('playerCover').src = cover;

  document.getElementById('audio').src = trackPath;
  document.getElementById('audio').play();
}
