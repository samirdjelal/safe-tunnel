const crypto = require('crypto');


const encrypt = async (publicKeyServer = '', privateKeyClient = '', plaintext = '') => {
	const RANDOM_KEY = new Date().getTime() + publicKeyServer + plaintext;
	const KEY = crypto.createHash('md5').update(RANDOM_KEY).digest('hex');
	const IV = KEY.split('').reverse().join('').substr(16); // reverse the md5(key), and take last 16 char
	
	let Cipher = crypto.createCipheriv('aes-256-cbc', KEY, IV);
	let CMSG = Cipher.update(plaintext, 'utf8', 'base64');
	CMSG += Cipher.final('base64');
	
	let CKEY = crypto.publicEncrypt({key: publicKeyServer, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256",}, Buffer.from(KEY));
	
	let SIGNATURE = crypto.sign("sha256", Buffer.from(plaintext), {
		key: privateKeyClient,
		padding: crypto.constants.RSA_PKCS1_PSS_PADDING
	})
	return {
		message: CMSG,
		key: CKEY,
		signature: SIGNATURE
	}
}

const decrypt = async (privateKeyClient = '', publicKeyServer, key = '', cipher = '', signature = '') => {
	const decryptedData = crypto.privateDecrypt(
		{
			key: privateKeyClient,
			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
			oaepHash: "sha256",
		},
		Buffer.from(key)
	)
	const KEY = decryptedData.toString();
	const IV = KEY.split('').reverse().join('').substr(16); // reverse the md5(key), and take last 16 char
	
	let Decipher = crypto.createDecipheriv('aes-256-cbc', KEY, IV);
	let MSG = Decipher.update(cipher, 'base64', 'utf8');
	MSG += Decipher.final('utf8');
	
	const VERIFIED_SIGNATURE = crypto.verify(
		"sha256", Buffer.from(MSG), {
			padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
			key: publicKeyServer
		},
		Buffer.from(signature)
	)
	console.log('VERIFIED_SIGNATURE', VERIFIED_SIGNATURE)
	return {
		MSG,
		SIGNATURE: VERIFIED_SIGNATURE
	};
	
}


const generate = () => {
	const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {modulusLength: 4096});
	return {
		privateKey: privateKey.export({format: "pem", type: "pkcs1"}),
		publicKey: publicKey.export({format: "pem", type: "pkcs1"})
	}
}

exports.generate = generate;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
