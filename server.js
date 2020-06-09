const WebSocket = require('ws');
const crypto = require('crypto');

const wss = new WebSocket.Server({
	port: 9999,
	
});
console.log('ws://127.0.0.1:9999')

const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {modulusLength: 2048});
const privateKeyServer = privateKey.export({format: "pem", type: "pkcs1"});
const publicKeyServer = publicKey.export({format: "pem", type: "pkcs1"});
// const privateKeyServer = privateKey;
// const publicKeyServer = publicKey;
// console.log(publicKeyServer)

let clients = [];
wss.on('connection', function connection(ws) {
	
	ws.on('close', function () {
		clients = clients.filter(client => {
			if (client.ws === ws) {
				console.log(client.name + ' Disconnected!');
			}
			return client.ws !== ws;
		})
	})
	
	ws.on('message', async function incoming(data) {
		let msg = JSON.parse(data);
		// console.log(msg)
		
		if (msg.action && msg.action === 'connect') {
			const client = clients.filter(client => (client.uid === msg.uid))
			if (client.length === 0) {
				// console.log(msg.name + ' Connected!');
				clients.push({
					uid: msg.uid,
					name: msg.name,
					publicKey: msg.publicKey,
					ws: ws,
				});
				// console.log('publicKeyServer', publicKeyServer)
				ws.send(JSON.stringify({
					uid: msg.uid,
					name: msg.name,
					publicKeyServer: publicKeyServer,
					action: 'connected'
				}));
			}
		} else {
			
			// clients.forEach(client => {
			// 	if (client.readyState === WebSocket.OPEN) {
			// 		let newMsg = JSON.stringify({
			// 			uid: msg.uid,
			// 			name: msg.name,
			// 			body: msg.body
			// 		});
			// 		client.send(newMsg);
			// 		console.log('received: %s', msg);
			// 	}
			// })
			//
			// console.log(msg.message)
			// console.log(msg.key)
			// console.log(msg.key.toString('utf-8'))
			
			
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
			
			// console.log('KEY: ', KEY)
			// console.log('MSG: ', MSG)
			
			for (const client of clients) {
				if (client.ws.readyState === WebSocket.OPEN) {
					// console.log('sending to ',client.name)
					
					const KEY = crypto.createHash('md5').update('key here .....').digest('hex');
					const IV = KEY.split('').reverse().join('').substr(16); // reverse the md5(key), and take last 16 char
					
					let Cipher = crypto.createCipheriv('aes-256-cbc', KEY, IV);
					let CMSG = Cipher.update(MSG, 'utf8', 'base64');
					CMSG += Cipher.final('base64');
					
					let CKEY = crypto.publicEncrypt({key: client.publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256",}, Buffer.from(KEY));
					// console.log('client.publicKey', client.publicKey)
					
					let newMsg = JSON.stringify({
						uid: msg.uid,
						name: msg.name,
						message: CMSG,
						key: CKEY
					});
					client.ws.send(newMsg);
				}
			}
			
			
			// wss.clients.forEach(function each(client) {
			// 	if (client.readyState === WebSocket.OPEN) {
			
			// client.
			// let msg = JSON.parse(data);
			
			
			// let newMsg = JSON.stringify({
			// 	uid: msg.uid,
			// 	name: msg.name,
			// 	body: msg.body
			// });
			// client.send(newMsg);
			
			
			// console.log('received: %s', msg);
			// }
			// });
			// console.log(clients.length)
			
		}
		
		
	});
	
});

//
// const encrypt = async (publicKey = '', key = '', plaintext = '') => {
//
// 	const KEY = crypto.createHash('md5').update(key).digest('hex');
// 	const IV = KEY.split('').reverse().join('').substr(16); // reverse the md5(key), and take last 16 char
//
// 	let CMSG = crypto.createCipheriv('aes-256-cbc', KEY, IV);
// 	CMSG.update(plaintext, 'utf8', 'base64');
// 	CMSG = CMSG.final('base64');
//
// 	let CKEY = await crypto.publicEncrypt({key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256",}, Buffer.from(KEY)).toString('base64');
//
// 	return {
// 		message: CMSG,
// 		key: CKEY
// 	}
//
// }


