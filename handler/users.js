const { writeDatabase, readDatabase } = require("../utils/database");

exports.register = (m, client, owner, sender, text) => {
    const usersData = readDatabase("users");
    const user = usersData.find((user) => user.number === sender);
    if (user) {
        m.reply("Anda sudah pernah mendaftar.");
    } else {
        const args = text.split("#");
        if (args.length !== 4) {
            return m.reply(
                `Format pendaftaran salah. Gunakan format
*.register NAMA#NIS/NIP#KELAS#PERAN*. _(Gunakan huruf kapital)_

contoh :
.register M. RIFQI IRAWAN#200209500003#TKJ2#SISWA

Jika anda mendaftar sebagai guru, berikan saja tanda strip ( - ) pada bagian ...#KELAS#...

contoh (mendaftar sebagai guru):
.register M. RIFQI IRAWAN#200206212025031007#-#GURU`,
            );
        }
        const [name, regnumber, group, role] = args;

        if (role !== "SISWA" && role !== "GURU") {
            return m.reply(
                "Role yang Anda masukkan tidak valid. Pilih antara *SISWA* atau *GURU*.",
            );
        }

        const newUser = {
            role: role,
            member: false,
            points: 10,
            number: sender,
            name: name,
            regnumber: regnumber,
            group: group,
        };
        usersData.push(newUser);
        writeDatabase("users", usersData);
        client.sendMessage(owner + "@s.whatsapp.net", {
            text: `⚠️Peserta Baru⚠️\n\nHalo, kyo.\n\nNama : ${name}\nNo.Reg : ${regnumber}\nKelas : ${group}\nPeran : ${role}\nno.WA : ${sender}\n\ntelah mendaftar sebagai calon anggota. mohon diterima dengan perintah\n\n*.member [nomor]*`,
        });
        m.reply(
            `Anda telah berhasil terdaftar dengan datar berikut:\n\nNama : ${name}\nNo.Reg : ${regnumber}\nKelas : ${group}\nPeran : ${role}\nno.WA : ${sender}\n\nAkun Anda sedang menunggu persetujuan dari owner.`,
        );
    }
};

exports.member = (m, text, client) => {
    if (!text.startsWith("62")) {
        return m.reply("format nomor salah. nomor harus berawalan *62...*");
    }
    const usersData = readDatabase("users");
    const user = usersData.find((user) => user.number === text);
    if (user) {
        user.member = true;
        writeDatabase("users", usersData);
        m.reply(`User dengan nomor ${text} telah diubah menjadi member.`);
        client.sendMessage(user.number + "@s.whatsapp.net", {
            text: `Selamat status anda telah menjadi member di Kyowa-Bot`,
        });
    } else {
        return m.reply("Nomor terkait belum pernah mendaftar");
    }
};

exports.addPoint = (m, text, client) => {
    if (!text.startsWith("62")) {
        return m.reply("format nomor salah. nomor harus berawalan *62...*");
    }
    const args = text.split("#");
    if (args.length !== 2) {
        m.reply(
            "Format perintah salah. Gunakan format *.addPoint nomor#jumlah_point*.\nContoh : *.changeLimit 6285399991111#12*",
        );
    } else {
        const [number, point] = args;
        const usersData = readDatabase("users");
        const user = usersData.find((user) => user.number === number);
        const pointInt = parseInt(point);
        if (user) {
            if (pointInt) {
                user.points += point;
                writeDatabase("users", usersData);
                m.reply(
                    `User dengan nomor ${text} telah mendapatkan penambahan *${point}* point.`,
                );
                client.sendMessage(user.number + "@s.whatsapp.net", {
                    text: `Selamat anda mendapatkan penambahan point di Kyowa-Bot sebanyak *${point}*.\ncek *.myprofile* untuk melihat status lengkap anda`,
                });
            } else {
                m.reply("Point harus angka integer");
            }
        } else {
            m.reply("Nomor terkait belum pernah mendaftar");
        }
    }
};

exports.kick = (m, text) => {
    if (!text.startsWith("62")) {
        return m.reply("format nomor salah. nomor harus berawalan *62...*");
    }
    const usersData = readDatabase("users");
    const user = usersData.find((user) => user.number === text);
    if (user) {
        usersData.splice(user, 1);
        writeDatabase("users", usersData);
        m.reply(`User dengan nomor ${text} telah di kick.`);
    } else {
        m.reply("Nomor terkait belum pernah mendaftar");
    }
};

exports.logout = (m, sender) => {
    const usersData = readDatabase("users");
    const user = usersData.find((user) => user.number === sender);
    if (user) {
        usersData.splice(user, 1);
        writeDatabase("users", usersData);
        m.reply(`Anda berhasil keluar.`);
    } else {
        m.reply("Anda memang belum pernah mendaftar -_-");
    }
};

exports.myprofile = (m, sender) => {
    const usersData = readDatabase("users");
    const user = usersData.find((user) => user.number === sender);
    if (user) {
        let status;
        if (user.member) {
            status = `Terdaftar sebagai ${user.role}`;
        } else {
            status = `Tertunda, silahkan hubungi admin`;
        }
        let myprofil = `╭───「 *Profil Saya* 」* 
│
├ • Nama : *${user.name}*
├ • No. Reg : *${user.regnumber}*
├ • Kelas : *${user.group}*
├ • No. HP : *${user.number}*
├ • Limit : *${user.points}*
│   
├ • Status : *${status}*
│   
╰───「 Kyowa Bot 」`;
        m.reply(myprofil);
    } else {
        m.reply("Anda belum terdaftar. Silahkan ketik *.register*");
    }
};
