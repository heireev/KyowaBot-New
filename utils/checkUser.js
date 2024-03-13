const { readDatabase } = require("../utils/database");

exports.checkUser = (m) => {
    // Pengecekan apakah pengguna telah terdaftar
    const sender = m.sender.replace("@s.whatsapp.net", ""); // user WA number
    const dbUsersData = readDatabase("users");
    const userData = dbUsersData.find(user => user.number === sender);

    if (!userData) {
        m.reply("Anda harus terdaftar sebelum dapat menggunakan perintah ini. Silahkan ketik *.register*");
        return false
    } else {
        if (userData.member) {
            if (userData.points > 0) {
                // Fungsi disetujui di sini
                return true;
            } else {
                m.reply("Maaf, Anda telah mencapai batas penggunaan. Silahkan hubungi *.owner* untuk penambahan poin");
                return false
            }
        } else {
            m.reply("Maaf, Anda belum terkonfirmasi menjadi member. Silahkan hubungi admin");
            return false
        }
    }
};

exports.checkUser2 = (m) => {
    // Pengecekan apakah pengguna telah terdaftar
    const sender = m.sender.replace("@s.whatsapp.net", ""); // user WA number
    const dbUsersData = readDatabase("users");
    const userData = dbUsersData.find(user => user.number === sender);

    if (!userData) {
        m.reply("Anda harus terdaftar sebelum dapat menggunakan perintah ini. Silahkan ketik *.register*");
        return false
    } else {
        if (userData.member) {
            return true;
        } else {
            m.reply("Maaf, Anda belum terkonfirmasi menjadi member. Silahkan hubungi admin");
            return false
        }
    }
};
