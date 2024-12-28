document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);

    document.getElementById('saveFolder').addEventListener('click', async () => {
        try {
            // Ask Electron to open a folder picker and get the full path
            const folderPath = await window.electronAPI.selectFolder();

            if (folderPath) {
                // Save the folder path
                localStorage.setItem('musicFolder', folderPath);

                // Send folder path to Electron's main process for scanning
                window.electronAPI.scanMusicFolder(folderPath);
                
                location.reload();
            } else {
                alert('No folder selected.');
            }
        } catch (error) {
            console.error('Error selecting folder:', error);
        }
    });
});
