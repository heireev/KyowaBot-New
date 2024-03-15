const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Kunci enkripsi. Harus dijaga dengan aman dan sama saat enkripsi dan dekripsi.
// const encryptionKey = crypto.randomBytes(32); // tidak disarankan untuk program yang sering restart
const encryptionKey = process.env["ENCRYPTION_KEY"];

exports.writeDatabase = (name, data) => {
  const filePath = path.join(process.cwd(), "database", `${name}.json`);
  const formattedData =
    typeof data === "string" ? data : JSON.stringify(data, null, 2);

  // Mengenkripsi data sebelum menuliskannya ke berkas
  const cipher = crypto.createCipher("aes-256-cbc", encryptionKey);
  let encryptedData = cipher.update(formattedData, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  // Tulis data yang dienkripsi ke berkas
  fs.writeFileSync(filePath, encryptedData);
};

exports.readDatabase = (name) => {
  const filePath = path.join(process.cwd(), "database", `${name}.json`);
  if (fs.existsSync(filePath)) {
    // Membaca data terenkripsi dari berkas
    const encryptedData = fs.readFileSync(filePath, "utf-8");

    // Mendekripsi data sebelum memparsing JSON
    const decipher = crypto.createDecipher("aes-256-cbc", encryptionKey);
    let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
    decryptedData += decipher.final("utf-8");

    return JSON.parse(decryptedData);
  } else {
    return [];
  }
};

/* // Versi lama (Tanpa Crypto)
const fs = require('fs')
const path = require('path')

exports.writeDatabase = (name, data) => {
    const filePath = path.join(process.cwd(), 'database', `${name}.json`);
    const formattedData = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

    // Tulis data baru ke file dengan menghapus konten sebelumnya.
    fs.writeFileSync(filePath, formattedData);
}

exports.readDatabase = (name) => {
    const filePath = path.join(process.cwd(), "database", `${name}.json`);
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } else {
        return [];
    }
};
*/
