const crypto = require('crypto-js');
const plainPass = process.argv[2];

//if (!plainPass) {
//    return console.log('Usage: generate <password>')
//}
generateKey(plainPass);

function generateKey(passwd){
    const salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const key = crypto.SHA512(salt).toString();
    console.log(`secret_key: ${key}`);
    if (!passwd) return;
    generatePassword(passwd, key);
}

function generatePassword(passwd, key) {
    const cryptPass = crypto.AES.encrypt(passwd, key).toString();
    const decryptPass = hex_to_ascii(crypto.AES.decrypt(cryptPass, key).toString());
    console.log(`crypto_passwd : ${cryptPass}`);
    console.log(`plain_passwd : ${decryptPass}`);
}

function hex_to_ascii(str1)
 {
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }

 module.exports = hex_to_ascii;