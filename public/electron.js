// const electron = require('electron');
const {app, BrowserWindow, ipcMain} = require('electron');
const {encrypt, decrypt, generate} = require('./encyption');
const WebSocket = require('ws');
// const axios = require("axios");
const path = require('path');
const isDev = require('electron-is-dev');

const WebSocketURL = 'ws://127.0.0.1:9999';
// const WebSocketURL = 'ws://192.168.0.100:9999';
// const WebSocketURL = 'ws://dzprime.com:9999';

let privateKeyClient = '';
let publicKeyClient = '';
let publicKeyServer = '';


app.allowRendererProcessReuse = true;
let mainWindow;


function createWindow() {
	mainWindow = new BrowserWindow({
		// minWidth: 700,
		// minHeight: 500,
		// maxWidth: 1000,
		// maxHeight: 800,
		width: 450,
		height: 600,
		show: false,
		maximizable: false,
		resizable: false,
		// fullscreen: false,
		// frame: false,
		// titleBarStyle: 'hidden',
		// transparent: true,
		// icon: path.join(__dirname, (process.platform === 'darwin') ? 'icons/app.icns' : 'icons/app.png'),
		webPreferences: {
			nodeIntegration: true,
			// preload: __dirname + '/preload.js',
			// webSecurity: false,
			// allowRunningInsecureContent: true,
			// webviewTag: true,
			// javascript: true
		}
	});
	mainWindow.show();
	mainWindow.setMenu(null);
	
	mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`).then(r => console.log(r));
	mainWindow.on('closed', () => mainWindow = null);
	mainWindow.webContents.openDevTools();
	
	if (isDev) {
		mainWindow.webContents.openDevTools();
		const {default: installExtension, REACT_DEVELOPER_TOOLS} = require('electron-devtools-installer');
		try {
			installExtension(REACT_DEVELOPER_TOOLS).then((name) => {
				console.log(`Added Extension:  ${name}`);
			}).catch((err) => {
				console.log('An error occurred: ', err)
			});
		} catch (e) {
		}
	} else {
	}
	
}

app.whenReady().then(() => {
	createWindow();
})


app.on('window-all-closed', () => {
	try {
		ws.close();
	} catch {
	}
	app.quit();
});

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
	event.preventDefault();
	callback(true);
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});


let ws = new WebSocket(WebSocketURL, {
	perMessageDeflate: false
})
// ws.on('open', function open() {});

ipcMain.on('CONNECT', async (event, args) => {
	const {privateKey, publicKey} = await generate();
	mainWindow.webContents.send('KEYS_GENERATED', {
		privateKey: privateKey,
		publicKey: publicKey
	})
	privateKeyClient = privateKey;
	publicKeyClient = publicKey;
	
	ws.send(JSON.stringify({
		uid: args.uid,
		name: args.name,
		action: args.action,
		publicKey: publicKey
	}));
	
})

ipcMain.on('SEND_MESSAGE', async (event, args) => {
	const {message, key} = await encrypt(publicKeyServer, args.body);
	ws.send(JSON.stringify({
		uid: args.uid,
		name: args.name,
		message: message,
		key: key
	}));
})

ipcMain.on('SEND_FILE', async (event, args) => {
	const {message, key} = await encrypt(publicKeyServer, args.fileData);
	ws.send(JSON.stringify({
		action: 'file',
		uid: args.uid,
		name: args.name,
		fileName: args.fileName,
		fileSize: args.fileSize,
		fileType: args.fileType,
		message: message,
		key: key
	}));
	mainWindow.webContents.send('ALERT', {
		alert: 'file sent'
	})
})

ws.on('message', async function incoming(data) {
	let msg = JSON.parse(data)
	
	if (msg.action && msg.action === 'connected') {
		publicKeyServer = msg.publicKeyServer;
		mainWindow.webContents.send('CONNECTED', {
			uid: msg.uid,
			name: msg.name,
			publicKeyServer: msg.publicKeyServer,
			action: 'connected'
		})
		
	} else if (msg.alertMessage) {
		console.log('alert ========> ', msg.alertMessage)
		mainWindow.webContents.send('ALERT', {
			alert: msg.alertMessage
		})
		
	} else if (msg.action && msg.action === 'file') {
		const file = await decrypt(privateKeyClient, msg.key, msg.message);
		mainWindow.webContents.send('RECEIVE_FILE', {
			uid: msg.uid,
			name: msg.name,
			fileName: msg.fileName,
			fileSize: msg.fileSize,
			fileType: msg.fileType,
			fileData: file
		})
	} else {
		const plaintext = await decrypt(privateKeyClient, msg.key, msg.message);
		mainWindow.webContents.send('RECEIVE_MESSAGE', {
			uid: msg.uid,
			name: msg.name,
			body: plaintext
		})
	}
	
});

