const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const secretKey = process.env.ENCRYPTION_KEY
    ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
    : (() => { throw new Error('ENCRYPTION_KEY is missing in .env'); })();

const ivLength = 16; // For AES, this is always 16

const encrypt = (text) => {
    if (!text) return text;
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex') + ':' + cipher.getAuthTag().toString('hex');
};

const decrypt = (text) => {
    if (!text) return text;
    // Handle unencrypted legacy data gracefully (if needed, or fail)
    // Format: iv:encrypted:authTag
    const textParts = text.split(':');
    if (textParts.length < 3) return text; // Assuming plain text if not in format

    const iv = Buffer.from(textParts.shift(), 'hex');
    const authTag = Buffer.from(textParts.pop(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');

    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
};

const hash = (text) => {
    if (!text) return text;
    return crypto.createHash('sha256').update(text).digest('hex');
};

module.exports = { encrypt, decrypt, hash };
