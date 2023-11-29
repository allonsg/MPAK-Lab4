const readline = require('readline');
const crypto = require('crypto-js');
const fs = require('fs');
const path = require('path');

function prompt(question) {
    const r = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    return new Promise((resolve) => {
        r.question(question, answer => {
            r.close()
            resolve(answer)
        });
    })
}

async function generateSessionKey() {
    const password = await prompt('Please enter your password: ');
    const hashedPassword = crypto.SHA256(password).toString();
    return hashedPassword;
}

async function promptEncryptionMode() {
    const mode = await prompt('Please enter the encryption mode (ECB, CBC, CFB): ');
    return mode.toUpperCase();
}

async function encryptDecryptData() {
    const sessionKey = await generateSessionKey();
    const mode = await promptEncryptionMode();
    const filePath = await prompt('Please enter the path to the file to encrypt: ');
    const data = fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');
    const encryptedData = crypto.AES.encrypt(data, sessionKey, {mode: crypto.mode[mode]}).toString();
    console.log('Encrypted data: ', encryptedData);

    fs.writeFileSync(path.resolve(__dirname, 'encrypted.txt'), encryptedData, 'utf8');

    const decryptedData = crypto.AES.decrypt(encryptedData, sessionKey, {mode: crypto.mode[mode]}).toString(crypto.enc.Utf8);
    console.log('Decrypted data: ', decryptedData);

    fs.writeFileSync(path.resolve(__dirname, 'decrypted.txt'), decryptedData, 'utf8');
}

encryptDecryptData();
