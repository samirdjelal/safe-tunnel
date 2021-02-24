const WebSocket = require('ws');
const crypto = require('crypto');

const wss = new WebSocket.Server({
	port: 3000,
});

console.log('ws://127.0.0.1:3000')

const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {modulusLength: 4096});
const privateKeyServer = privateKey.export({format: "pem", type: "pkcs1"});
const publicKeyServer = publicKey.export({format: "pem", type: "pkcs1"});

let clients = [];
wss.on('connection', function connection(ws) {
	
	ws.on('close', function () {
		let disconnected_client = {};
		clients = clients.filter(client => {
			if (client.ws === ws) {
				disconnected_client = client;
			}
			return client.ws !== ws;
		})
		
		for (const client of clients) {
			if (client.ws.readyState === WebSocket.OPEN && disconnected_client.channel === client.channel) {
				client.ws.send(JSON.stringify({
					alertMessage: `${disconnected_client.name} has disconnected`
				}));
			}
		}
		
	})
	
	ws.on('message', async function incoming(data) {
		let msg = JSON.parse(data);
		
		if (msg.action && msg.action === 'connect') {
			const client = clients.filter(client => (client.uid === msg.uid))
			if (client.length === 0) {
				clients.push({uid: msg.uid, name: msg.name, channel: msg.channel, publicKey: msg.publicKey, ws: ws});
				
				ws.send(JSON.stringify({
					uid: msg.uid,
					name: msg.name,
					channel: msg.channel,
					publicKeyServer: publicKeyServer,
					action: 'connected'
				}));
				
				const other_clients = clients.filter(client => (client.uid !== msg.uid))
				for (const client of other_clients) {
					if (client.ws.readyState === WebSocket.OPEN && msg.channel === client.channel) {
						client.ws.send(JSON.stringify({
							alertMessage: `${msg.name} is connected`
						}));
					}
				}
			}else{
				ws.send(JSON.stringify({
					action: 'user_exists'
				}));
			}
			
		} else if (msg.action && msg.action === 'channel') {
			const client = clients.filter(client => (client.uid === msg.uid))
			let previousChannel = '';
			if (client.length > 0) {
				clients = clients.map(client => {
					if (client.uid === msg.uid) {
						previousChannel = client.channel;
						return {uid: client.uid, name: client.name, channel: msg.channel, publicKey: client.publicKey, ws: client.ws}
					}
					return client;
				})
				
				for (const _client of clients) {
					if (_client.ws.readyState === WebSocket.OPEN && _client.uid !== msg.uid && _client.channel === msg.channel) {
						_client.ws.send(JSON.stringify({
							alertMessage: `${msg.name} joined the channel`
						}));
					}
					if (_client.ws.readyState === WebSocket.OPEN && _client.uid !== msg.uid && _client.channel === previousChannel) {
						_client.ws.send(JSON.stringify({
							alertMessage: `${msg.name} left the channel`
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
			
			const client = await clients.filter(client => (client.uid === msg.uid))
			const VERIFIED_SIGNATURE = crypto.verify(
				"sha256", Buffer.from(MSG), {
					padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
					key: client[0].publicKey
				},
				Buffer.from(msg.signature)
			)
			console.log('VERIFIED_SIGNATURE', VERIFIED_SIGNATURE);
			if (VERIFIED_SIGNATURE !== true) return;
			for (const client of clients) {
				if (client.ws.readyState === WebSocket.OPEN && msg.channel === client.channel && msg.uid !== client.uid) {
					const RANDOM_KEY = new Date().getTime() + client.publicKey + MSG;
					const KEY = crypto.createHash('md5').update(RANDOM_KEY).digest('hex');
					const IV = KEY.split('').reverse().join('').substr(16); // reverse the md5(key), and take last 16 char
					
					let Cipher = crypto.createCipheriv('aes-256-cbc', KEY, IV);
					let CMSG = Cipher.update(MSG, 'utf8', 'base64');
					CMSG += Cipher.final('base64');
					
					let CKEY = crypto.publicEncrypt({key: client.publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256",}, Buffer.from(KEY));
					
					
					let SIGNATURE = crypto.sign("sha256", Buffer.from(MSG), {
						key: privateKeyServer,
						padding: crypto.constants.RSA_PKCS1_PSS_PADDING
					})
					
					
					if (msg.action && msg.action === 'file') {
						client.ws.send(JSON.stringify({
							action: 'file',
							uid: msg.uid,
							name: msg.name,
							channel: msg.channel,
							fileName: msg.fileName,
							fileSize: msg.fileSize,
							fileType: msg.fileType,
							message: CMSG,
							key: CKEY,
							signature: SIGNATURE
						}));
					} else {
						client.ws.send(JSON.stringify({
							uid: msg.uid,
							name: msg.name,
							channel: msg.channel,
							message: CMSG,
							key: CKEY,
							signature: SIGNATURE
						}));
					}
					
					
				}
			}
		}
	});
});

