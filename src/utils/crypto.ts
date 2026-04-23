import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_SECRET || 'hcms-default-fallback-key-321';

/**
 * Encrypts data using AES
 * @param data Any data to encrypt
 * @returns Encrypted string
 */
export const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

/**
 * Decrypts data using AES
 * @param ciphertext Encrypted string
 * @returns Decrypted data or null if failure
 */
export const decryptData = (ciphertext: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData ? JSON.parse(decryptedData) : null;
  } catch (error) {
    console.error('[Crypto] Decryption failed:', error);
    return null;
  }
};
