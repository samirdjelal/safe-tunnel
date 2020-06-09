const crypto = require('crypto');

const encrypt = async (publicKey = '', key = '', plaintext = '') => {
	
	const KEY = crypto.createHash('md5').update(key).digest('hex');
	const IV = KEY.split('').reverse().join('').substr(16); // reverse the md5(key), and take last 16 char
	
	let Cipher = crypto.createCipheriv('aes-256-cbc', KEY, IV);
	let CMSG = Cipher.update(plaintext, 'utf8', 'base64');
	CMSG += Cipher.final('base64');
	
	let CKEY = crypto.publicEncrypt({key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256",}, Buffer.from(KEY));

	return {
		message: CMSG,
		key: CKEY
	}
	
}

const decrypt = async (privateKey = '', key = '', cipher = '') => {
	const decryptedData = crypto.privateDecrypt(
		{
			key: privateKey,
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
	return MSG;
	
}


const generate = () => {
	const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {modulusLength: 2048});
	return {
		privateKey: privateKey.export({format: "pem", type: "pkcs1"}),
		publicKey: publicKey.export({format: "pem", type: "pkcs1"})
	}
}

exports.generate = generate;
exports.encrypt = encrypt;
exports.decrypt = decrypt;


//
// const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
// 	modulusLength: 2048
// });
//
// console.log('privateKey ', privateKey.)
// console.log('publicKey ', publicKey)

// const sign = crypto.createSign('SHA256');
// sign.update(plaintext);
// sign.end();
// const signature = sign.sign(privateKey);
// console.log('signature', signature)
//
//
// const verify = crypto.createVerify('SHA256');
// verify.update(plaintext);
// verify.end();
// console.log('verify signature', verify.verify(publicKey, signature));

// return {
// 	algorithm,
// 	key,
// 	plaintext
// }
