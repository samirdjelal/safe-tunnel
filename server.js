const WebSocket = require('ws');
const crypto = require('crypto');

const wss = new WebSocket.Server({
	port: 9999,
	
});
console.log('ws://127.0.0.1:9999')

const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {modulusLength: 4096});
const privateKeyServer = privateKey.export({format: "pem", type: "pkcs1"});
const publicKeyServer = publicKey.export({format: "pem", type: "pkcs1"});

let clients = [];
wss.on('connection', function connection(ws) {
	
	ws.on('close', function () {
		clients = clients.filter(client => {
			if (client.ws === ws) {
				console.log(client.name + ' Disconnected!');
				for (const C of clients) {
					if (C.ws.readyState === WebSocket.OPEN && C.ws !== ws) {
						C.ws.send(JSON.stringify({
							action: 'alert',
							message: `${client.name} left the chat`
						}));
					}
				}
			}
			return client.ws !== ws;
		})
	})
	
	ws.on('message', async function incoming(data) {
		let msg = JSON.parse(data);
		
		if (msg.action && msg.action === 'connect') {
			const client = clients.filter(client => (client.uid === msg.uid))
			if (client.length === 0) {
				console.log(msg.name + ' Connected!');
				clients.push({
					uid: msg.uid,
					name: msg.name,
					publicKey: msg.publicKey,
					ws: ws,
				});
				ws.send(JSON.stringify({
					uid: msg.uid,
					name: msg.name,
					publicKeyServer: publicKeyServer,
					action: 'connected'
				}));
				
				for (const client of clients) {
					if (client.ws.readyState === WebSocket.OPEN && client.ws !== ws) {
						ws.send(JSON.stringify({
							action: 'alert',
							message: `${msg.name} joined the chat`
						}));
					}
				}
				
			}
		} else {
			const decryptedData = await crypto.privateDecrypt(
				{
					key: privateKeyServer,
					padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
					oaepHash: "sha256",
				},
				Buffer.from(msg.key)
			)
			const KEY = decryptedData.toString();
			const IV = KEY.split('').reverse().join('').substr(16); // reverse the md5(key), and take last 16 char
			
			let Decipher = crypto.createDecipheriv('aes-256-cbc', KEY, IV);
			let MSG = Decipher.update(msg.message, 'base64', 'utf8');
			MSG += Decipher.final('utf8');
			
			for (const client of clients) {
				if (client.ws.readyState === WebSocket.OPEN) {
					const RANDOM_KEY = new Date().getTime() + client.publicKey + MSG;
					const KEY = crypto.createHash('md5').update(RANDOM_KEY).digest('hex');
					const IV = KEY.split('').reverse().join('').substr(16); // reverse the md5(key), and take last 16 char
					
					let Cipher = crypto.createCipheriv('aes-256-cbc', KEY, IV);
					let CMSG = Cipher.update(MSG, 'utf8', 'base64');
					CMSG += Cipher.final('base64');
					
					let CKEY = crypto.publicEncrypt({key: client.publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256",}, Buffer.from(KEY));
					
					if (msg.action && msg.action === 'file') {
						client.ws.send(JSON.stringify({
							action: 'file',
							uid: msg.uid,
							name: msg.name,
							fileName: msg.fileName,
							filePath: msg.filePath,
							fileSize: msg.fileSize,
							fileType: msg.fileType,
							message: CMSG,
							key: CKEY
						}));
					} else {
						client.ws.send(JSON.stringify({
							uid: msg.uid,
							name: msg.name,
							message: CMSG,
							key: CKEY
						}));
					}
				}
			}
		}
	});
});

