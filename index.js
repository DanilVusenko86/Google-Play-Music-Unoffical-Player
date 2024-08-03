const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const mainWindow = new BrowserWindow({
    titleBarOverlay: {
			color: '#ef6d00'
		},
		width: 1098,
		height: 628,
        icon: path.join(__dirname, 'icon.ico'), // Set the icon here
		autoHideMenuBar: true,
		webPerferences: {
			nodeIntegration: true
		}
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});