const { writeDatabase, readDatabase } = require("../utils/database");
const chalk = require("chalk");

// Buat Tugas Siswa
exports.taskReminder = (client, myAds) => {
    const dbTaskData = readDatabase("usertask");
    // console.log(chalk.white(chalk.bgGreen("[ TASK REMINDER ]")), chalk.magenta("Melakukan pemeriksaan task"));
    if (dbTaskData.length === 0) {
        // console.log(chalk.white(chalk.bgGreen("[ TASK REMINDER ]")), chalk.green("Tidak ada task yang perlu diperiksa"));
    } else {
        // console.log(chalk.white(chalk.bgGreen("[ TASK REMINDER ]")), chalk.yellow("Task siswa terdeteksi"));
        dbTaskData.forEach((task, index) => {
            const { number, taskName, deadline, timeDeadline, link } = task;
            const currentTime = new Date().getTime();
            const timeRemaining = timeDeadline - currentTime;
            let hours = Math.floor(
                (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            );
            // Mengurangkan 8 jam
            hours -= 8;
            const minutes = Math.floor(
                (timeRemaining % (1000 * 60 * 60)) / (1000 * 60),
            );

            if (hours === 0 && minutes === 59) {
                console.log(
                    chalk.white(chalk.bgGreen("[ TASK REMINDER ]")),
                    chalk.magenta("Sedang memberikan reminder ke "),
                    chalk.yellow(`[ ${number} ]`),
                );
                client.sendMessage(number + "@s.whatsapp.net", {
                    text: `⚠️Pesan Pengingat⚠️\n\ntugas : *${taskName}*\ntenggat : *${deadline}*\nlink : *${link}*\n\nakan berakhir 1 jam lagi ⏳`,
                    contextInfo: myAds,
                });
            }
            if (hours <= -1 && minutes <= 59) {
                console.log(
                    chalk.white(chalk.bgGreen("[ TASK REMINDER ]")),
                    chalk.magenta("mencoba menghapus task terkait"),
                );
                client.sendMessage(number + "@s.whatsapp.net", {
                    text: `⚠️Pesan Pengingat⚠️\n\ntugas : *${taskName}*\ntenggat : *${deadline}*\nlink : *${link}*\n\nsudah berakhir sekarang ✅`,
                    contextInfo: myAds,
                });
                // Menghapus data dari array
                dbTaskData.splice(index, 1);
                writeDatabase("usertask", dbTaskData); // Simpan kembali data yang sudah dihapus
            }
        });
    }
};

exports.createTask = async (m, sender, text) => {
    const dbTaskData = readDatabase("usertask");
    const args = text.split("#");
    if (args.length !== 3) {
        m.reply(
            "Format perintah salah. Gunakan format *.buat_tugas [nama_tugas]#[YYYY-MM-DD HH:mm]#[link GForm/GDrive]*.\n\nContoh : *.buat_tugas Buat Video Tutorial#2023-08-31 14:00#https://drive.google.com/drive/...*",
        );
    } else {
        const [taskName, deadline, link] = args;
        const timeDeadline = new Date(deadline).getTime();
        if (isNaN(timeDeadline)) {
            m.reply(
                "Format deadline salah. Gunakan format tanggal yang valid.",
            );
        } else {
            // addTaskToDatabase(sender, taskName, timeDeadline);
            const newTask = {
                number: sender,
                taskName: taskName,
                deadline: deadline,
                timeDeadline: timeDeadline,
                link: link,
            };
            dbTaskData.push(newTask);
            await writeDatabase("usertask", dbTaskData);
            m.reply(
                `Tugas "${taskName}" dengan deadline ${deadline} telah ditambahkan.`,
            );
        }
    }
};

exports.showTask = (m, sender) => {
    const dbTaskData = readDatabase("usertask");
    if (dbTaskData.length === 0) {
        console.log(
            chalk.white(chalk.bgGreen("[ TASK REMINDER ]")),
            chalk.magenta("Tidak ada tugas yang perlu diperiksa"),
        );
        m.reply(`Tidak ada tugas yang perlu diperiksa`);
    } else {
        let listTask = "╭───「 *List Tugas Anda* 」\n";
        const currentTime = new Date().getTime();
        listTask += dbTaskData
            .filter((task) => task.number === sender)
            .map((task) => {
                const { taskName, timeDeadline, deadline } = task;
                const timeRemaining = timeDeadline - currentTime;

                const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
                let hours = Math.floor(
                    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                );
                hours -= 8;
                const minutes = Math.floor(
                    (timeRemaining % (1000 * 60 * 60)) / (1000 * 60),
                );

                const timeRemainingString = `${days}hari ${hours}jam ${minutes}menit`;

                return `│\n├ • *${taskName}* || ${deadline}\n│   berakhir dalam : ${timeRemainingString}\n`;
            })
            .join("");
        m.reply(`${listTask}│\n╰───「 Kyowa Bot 」`);
    }
};

// Buat Tugas Group
exports.groupTaskReminder = (client, myAds) => {
    const dbTaskData = readDatabase("grouptask");
    // console.log(chalk.white(chalk.bgGreen("[ TASK REMINDER ]")), chalk.magenta("Melakukan pemeriksaan task"));
    if (dbTaskData.length === 0) {
        // console.log(chalk.white(chalk.bgGreen("[ TASK REMINDER ]")), chalk.green("Tidak ada task yang perlu diperiksa"));
    } else {
        // console.log(chalk.white(chalk.bgGreen("[ TASK REMINDER ]")), chalk.yellow("Task siswa terdeteksi"));
        dbTaskData.forEach((task, index) => {
            const { groupID, taskName, deadline, timeDeadline, link } = task;
            const currentTime = new Date().getTime();
            const timeRemaining = timeDeadline - currentTime;
            let hours = Math.floor(
                (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            );
            // Mengurangkan 8 jam
            hours -= 8;
            const minutes = Math.floor(
                (timeRemaining % (1000 * 60 * 60)) / (1000 * 60),
            );

            if (hours === 0 && minutes === 59) {
                console.log(
                    chalk.white(chalk.bgGreen("[ TASK REMINDER ]")),
                    chalk.magenta("Sedang memberikan reminder ke "),
                    chalk.yellow(`[ ${groupID} ]`),
                );
                client.sendMessage(groupID, {
                    text: `⚠️Pesan Pengingat⚠️\n\ntugas group : *${taskName}*\ntenggat : *${deadline}*\nlink : *${link}*\n\nakan berakhir 1 jam lagi ⏳`,
                    contextInfo: myAds,
                });
            }
            if (hours <= -1 && minutes <= 59) {
                console.log(
                    chalk.white(chalk.bgGreen("[ TASK REMINDER ]")),
                    chalk.magenta("mencoba menghapus task terkait"),
                );
                client.sendMessage(groupID, {
                    text: `⚠️Pesan Pengingat⚠️\n\ntugas group : *${taskName}*\ntenggat : *${deadline}*\nlink : *${link}*\n\nsudah berakhir sekarang ✅`,
                    contextInfo: myAds,
                });
                // Menghapus data dari array
                dbTaskData.splice(index, 1);
                writeDatabase("grouptask", dbTaskData); // Simpan kembali data yang sudah dihapus
            }
        });
    }
};

exports.createGroupTask = async (m, groupID, text) => {
    const dbTaskData = readDatabase("grouptask");
    const args = text.split("#");
    if (args.length !== 3) {
        m.reply(
            "Format perintah salah. Gunakan format *.buat_tugas_grup [nama_tugas]#[YYYY-MM-DD HH:mm]#[link GForm/GDrive]*.\n\nContoh: *.buat_tugas_grup Presentasi Proyek#2023-08-31 14:00#https://drive.google.com/drive/...*",
        );
    } else {
        const [taskName, deadline, link] = args;
        const timeDeadline = new Date(deadline).getTime();
        if (isNaN(timeDeadline)) {
            m.reply(
                "Format deadline salah. Gunakan format tanggal yang valid.",
            );
        } else {
            const newGroupTask = {
                groupID: groupID,
                taskName: taskName,
                deadline: deadline,
                timeDeadline: timeDeadline,
                link: link,
            };
            dbTaskData.push(newGroupTask);
            await writeDatabase("grouptask", dbTaskData);
            m.reply(
                `Tugas "${taskName}" dengan deadline ${deadline} telah ditambahkan ke grup.`,
            );
        }
    }
};

exports.showGroupTask = (m, groupId) => {
    const dbTaskData = readDatabase("grouptask");
    if (dbTaskData.length === 0) {
        console.log(
            chalk.white(chalk.bgGreen("[ TASK REMINDER ]")),
            chalk.magenta("Tidak ada tugas grup yang perlu diperiksa"),
        );
        m.reply(`Tidak ada tugas grup yang perlu diperiksa`);
    } else {
        let listGroupTask = "╭───「 *List Tugas Grup Anda* 」\n";
        const currentTime = new Date().getTime();
        listGroupTask += dbTaskData
            .filter((task) => task.groupID === groupId)
            .map((task) => {
                const { taskName, timeDeadline, deadline } = task;
                const timeRemaining = timeDeadline - currentTime;

                const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
                let hours = Math.floor(
                    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                );
                hours -= 8;
                const minutes = Math.floor(
                    (timeRemaining % (1000 * 60 * 60)) / (1000 * 60),
                );

                const timeRemainingString = `${days}hari ${hours}jam ${minutes}menit`;

                return `│\n├ • *${taskName}* || ${deadline}\n│   berakhir dalam : ${timeRemainingString}\n`;
            })
            .join("");
        m.reply(`${listGroupTask}│\n╰───「 Kyowa Bot 」`);
    }
};

//BETA FEATURE - ABSEN SISWA
let absentData = [];
let isAbsentRunning = false;

// Fungsi untuk memproses perintah absen dari guru
exports.processAbsenCommand = async (m, sender) => {
    // Menetapkan batas waktu 30 menit
    const startTime = m.messageTimestamp;
    const endTime = startTime + 1 * 60 * 1000; // 30 menit dalam milidetik

    // Memberikan arahan kepada siswa untuk absen
    m.reply("Halo siswa! Mohon absen dengan mengirimkan perintah `.absen hadir` atau `.absen izin`.");

    // Set variabel isAbsenRunning menjadi true
    isAbsentRunning = true;
    
    // Set timeout untuk menutup absen setelah 30 menit
    setTimeout(async () => {
        // Menampilkan data absen dengan format yang diinginkan
        const formattedAbsen = absentData.map(data => `├ • [${data.status}] - ${data.name}`).join("\n");
        m.reply("╭───「 *✅ Absensi Siswa - SELESAI ✅* 」\n│\n" + formattedAbsen + "\n│\n╰───「 Kyowa Bot 」");

        // Set variabel isAbsenRunning menjadi false setelah selesai
        isAbsentRunning = false;
        
        // Mengosongkan data absen
        absentData = [];
    }, 1 * 60 * 1000); // Setelah 30 menit
};

// Fungsi untuk memproses perintah absen dari siswa
exports.processAbsenSiswa = async (m, sender, text) => {
    // Mengecek apakah waktu absen sudah berjalan
    if (!isAbsentRunning) {
        return m.reply("Absen belum dibuka atau sudah berakhir.");
    }
    
    if (text !== "hadir" && text !== "izin"){
        m.reply("Perintah absen tidak valid, silahkan gunakan perintah `.absen hadir` atau `.absen izin`.")
    } else {
        // Menyimpan data absen siswa
        const name = m.pushName
        const status = text
        absentData.push({ name, status });

        // Memberi konfirmasi kepada siswa
        m.reply(`Terima kasih, Anda telah melakukan absen dengan status: ${text}`);
    }
};
