const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { exec } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!MONGO_URI || !ENCRYPTION_KEY) {
    console.error('Error: MONGO_URI or ENCRYPTION_KEY is missing in .env');
    process.exit(1);
}

const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const BACKUP_DIR = path.join(__dirname, '../backups');
const DUMP_PATH = path.join(BACKUP_DIR, `temp-dump-${TIMESTAMP}.gz`);
const ENC_PATH = path.join(BACKUP_DIR, `backup-${TIMESTAMP}.enc`);

if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

// 1. Create Dump
console.log('Creating database dump...');
const dumpCmd = `mongodump --uri="${MONGO_URI}" --archive="${DUMP_PATH}" --gzip`;

exec(dumpCmd, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing mongodump: ${error.message}`);
        return;
    }
    console.log('Dump created. Encrypting...');

    // 2. Encrypt
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    const input = fs.createReadStream(DUMP_PATH);
    const output = fs.createWriteStream(ENC_PATH);

    // File Format: IV (16 bytes) + Ciphertext + Tag (16 bytes)
    output.write(iv);

    input.pipe(cipher).pipe(output, { end: false });

    cipher.on('end', () => {
        const authTag = cipher.getAuthTag();
        output.write(authTag);
        output.end();
    });

    output.on('finish', () => {
        console.log(`Backup successfully encrypted to: ${ENC_PATH}`);

        // 3. Cleanup
        fs.unlink(DUMP_PATH, (err) => {
            if (err) console.warn('Warning: Could not delete temp dump file.');
            else console.log('Cleaned up temporary items.');
        });
    });
});
