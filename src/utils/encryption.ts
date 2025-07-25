import crypto from "crypto";
const algorithm = "aes-128-cbc";
const key = "41d91aefcfa08e99";
const iv = "ee9e3676e2bbfd12";

function encrypt(text: string) {
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("base64");
}

function decrypt(text: string) {
    let encryptedText = Buffer.from(text, "base64");
    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export { encrypt, decrypt };
