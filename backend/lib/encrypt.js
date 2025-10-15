import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.XOR_CIPHER_KEY; // MUST be the same for encryption and decryption

/**
 * Simple XOR-based encryption/decryption using a key.
 * @param {string} text - The text to process.
 * @param {string} key - The secret key.
 * @returns {string} The processed string.
 */
const simpleXORCipher = (text, key) => {
  let output = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    output += String.fromCharCode(charCode);
  }
  return output;
};

/**
 * Encrypts the cell metadata object.
 * The output is Base64-encoded to handle special characters from the XOR cipher.
 * @param {Object} metadata - { table, idName, idValue, columnName }
 * @returns {string} The encrypted, Base64-encoded metadata string.
 */
export const encryptMetadata = (metadata) => {
  // Only encrypt the sensitive, structural parts
  const payload = JSON.stringify({
    t: metadata.table, // table
    iN: metadata.idName, // idName
    iV: metadata.idValue, // idValue
    cN: metadata.columnName, // columnName
  });

  const encrypted = simpleXORCipher(payload, SECRET_KEY);
  return Buffer.from(encrypted, 'binary').toString('base64');
};

/**
 * Decrypts the Base64-encoded metadata string.
 * @param {string} encryptedString - The encrypted string from the frontend.
 * @returns {Object} The decrypted metadata object.
 */
export const decryptMetadata = (encryptedString) => {
  try {
    const rawData = Buffer.from(encryptedString, 'base64').toString('binary');
    const decrypted = simpleXORCipher(rawData, SECRET_KEY);
    const payload = JSON.parse(decrypted);

    // Map back to full key names for clarity
    return {
      table: payload.t,
      idName: payload.iN,
      idValue: payload.iV,
      columnName: payload.cN
    };
  } catch (e) {
    console.error('Decryption failed:', e);
    // Throw error or return null/safe default depending on policy
    throw new Error('Invalid or corrupted metadata.');
  }
};