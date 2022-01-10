const crypto = require('crypto-js');
const cryptPasswd = process.argv[2];
const secretKey = process.argv[3];
const hex_to_ascii = require('./generate');

// const [...params] = process.argv;
// for (let i = 2; i < params.length; i++) {
//     const element = params[i];
//     console.log(element);    
// }
if (!cryptPasswd || !secretKey) {
    return console.log('Usage: decrypt <crypto_passwd> <secret_key>') 
}

return console.log(hex_to_ascii(crypto.AES.decrypt(cryptPasswd, secretKey).toString()));

function hex_ascii(str1)
 {
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }