const { 
    writeDatabase, readDatabase,
} = require("../utils/database");

exports.kontakStaf = async (m, client, text, mek) => {
    if (text == "") {
        /* // Gunakan ini untuk mengirim file
        try {
            const filePath = "./files/kontak_staf.pdf";
            client.sendDoc(m.chat, filePath, "test", "Kontak Staf.pdf", mek);
        } catch (error) {
            console.error(error);
            m.reply("Maaf, terjadi kesalahan saat mengirim file.");
        }
        */

        //Gunakan ini untuk menampilkan kontak staf dari database
        const dbStafData = readDatabase("kontakstaf");
        if (dbStafData.length === 0) {
            m.reply(`Data staf guru dan pegawai masih kosong`)
        } else {
            let listStaf = "╭───「 *Daftar Staf SMKN 01 Barru* 」\n"
            listStaf += dbStafData.map(staf => {
                const { code, name } = staf;
                return `│\n├ • *${name}*\n│   Kode Staf : ${code}\n`;
            })
            .join("");
            m.reply(`${listStaf}│\n╰───「 Kyowa Bot 」`);
            m.reply(`Anda bisa menghubungi staf dengan cara:\n*.kontak_staf [kode_staf]*\n\nGunakan fitur ini dengan bijak :)`)
        }
    } else {
        const args = text.split("#")
        if (args.length !== 2) {
            m.reply("Format perintah salah. Gunakan format *.kontak_staf [Kode Staf]#[Maksud dan Tujuan]*.\nContoh : *.kontak_staf XYZ#Saya ingin konsultasi lebih lanjut mengenai pembelajaran instalasi linux di virtual box*");
        } else {
            const [kode, tujuan] = args;
            //DB kontakstaf : kode, nama, number, jabatan
            const dbStafData = readDatabase("kontakstaf")
            const stafData = dbStafData.find(staf => staf.code === kode)

            //DB users : nama, nis, kelas, number
            const sender = m.sender.replace("@s.whatsapp.net", ""); // user WA number
            const dbUsersData = readDatabase("users");
            const userData = dbUsersData.find(user => user.number === sender);

            if (!stafData) {
                return m.reply("Kode staf yang anda berikan tidak ada dalam data")
            } else {
                let pesan = `📩 Pesan Siswa 📩\n
Permisi pak/ibu ${stafData.name}\n
Siswa SMKN 01 Barru, dengan data :
Nama  : *${userData.name}*
NIS      : *${userData.regnumber}*
Kelas  : *${userData.group}*\n
ingin menghubungi anda dengan tujuan :
=> ${tujuan}\n
Siswa terkait bisa dihubungi melalui
[ wa.me/${userData.number} ]`
                await client.sendMessage(stafData.number + "@s.whatsapp.net", { text: pesan })
                m.reply("Pesan berhasil dikirim")
            }
        }
    }
}

exports.addStaf = (m, text) => {
    const dbStafData = readDatabase("kontakstaf");
    const args = text.split("#")
    if (args.length !== 3) {
        m.reply("Format perintah salah. Gunakan format *.addstaf [kode]#[nama_staf]#[number]")
    } else {
        const [kode, nama, number] = args
        const newStaf = {
            code : kode,
            name : nama,
            number : number,
        }
        dbStafData.push(newStaf)
        writeDatabase("kontakstaf", dbStafData);
        m.reply(`Data staf ${nama} dengan kode ${kode} berhasil ditambahkan`)
    }
}

exports.delStaf = (m, text) => {
    const dbStafData = readDatabase("kontakstaf");
    if (text == "") {
        m.reply("Maaf anda harus sertakan kode Staf.\nContoh : *.delStaf [kode_staf]*")
    } else {
        const stafData = dbStafData.find(staf => staf.code === text)
        if (!stafData) {
            return m.reply("Kode staf yang anda berikan tidak ada dalam data")
        } else {
            const index = dbStafData.indexOf(stafData)
            dbStafData.splice(index, 1);
            writeDatabase("kontakstaf", dbStafData);
            m.reply(`Data staf dengan kode ${text} telah dihapus dari daftar.`);
        }
    }
}
