import crypto from "crypto"

function generateMD5(data) {
    return crypto.createHash('md5').update(data, 'utf8').digest('hex');
}

export {generateMD5}