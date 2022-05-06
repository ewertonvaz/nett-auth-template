const crypto = require('crypto-js');
const fs = require('fs');

const key = generateKey();
console.log(`secret_key:`, key);

var originalContent = readFile('.\\src\\config\\settings.example.ts');
var newContent = originalContent.replace("Use yarn generate para gerar esta chave", key);
writeFile('.\\src\\config\\settings_dev.ts', newContent);

var originalContent = readFile('.\\_volumes\\scripts\\script-mysql.samp.sql');
var newContent = originalContent.replace("Use o script yarn generate e coloque sua chave secreta aqui", key);
writeFile('.\\_volumes\\scripts\\script-mysql.sql', newContent);

var originalContent = readFile('.\\_volumes\\scripts\\init-postgres.samp.sql');
var newContent = originalContent.replace("Use o script yarn generate e coloque sua chave secreta aqui", key);
writeFile('.\\_volumes\\scripts\\init-postgres.sql', newContent);

function generateKey(){
    const salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const key = crypto.SHA512(salt).toString();
    return key;
}

function readFile(name) {
  const fileContent = fs.readFileSync(name);
  return fileContent.toString();
}

function writeFile(name, content) {
    if (fs.existsSync(name)) {
        console.log('O arquivo ', name, 'já existe! Não é seguro sobrescrever este arquivo.')
        return null;
    } else {
        const writeResult = fs.writeFileSync(name, content);
        return writeResult;
    }
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