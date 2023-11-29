const readline = require('readline');
const crypto = require('crypto-js');

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
    const data = await prompt('Please enter the data to encrypt: ');
    const encryptedData = crypto.AES.encrypt(data, sessionKey, {mode: crypto.mode[mode]}).toString();
    console.log('Encrypted data: ', encryptedData);

    const decryptedData = crypto.AES.decrypt(encryptedData, sessionKey, {mode: crypto.mode[mode]}).toString(crypto.enc.Utf8);
    console.log('Decrypted data: ', decryptedData);
}

encryptDecryptData();
