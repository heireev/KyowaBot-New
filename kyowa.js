const {
    BufferJSON,
    WA_DEFAULT_EPHEMERAL,
    generateWAMessageFromContent,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    prepareWAMessageMedia,
    areJidsSameUser,
    getContentType,
} = require("@ferdiz-afk/baileys");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");

const owner = ["6289502976892"];

const {
    // Lihat tentangku
    introOwner,

    // Lihat List Menu
    help,

    // Daftar List Menu
    kontak_admin,
    kontak_staf,
    jadwal_pelajaran,
    info_ekskul,
} = require("./utils/message.js");

// Var buat handle command
const {
    chatOpenai,
    imgOpenai,
    chatOpenaiTest,
} = require("./handler/openai.js");

// Check User Data
const { checkUser, checkUser2 } = require("./utils/checkUser.js");

// Main Code
module.exports = kyowa = async (client, m, chatUpdate, store) => {
    try {
        var body =
            m.mtype === "conversation"
                ? m.message.conversation
                : m.mtype == "imageMessage"
                  ? m.message.imageMessage.caption
                  : m.mtype == "videoMessage"
                    ? m.message.videoMessage.caption
                    : m.mtype == "extendedTextMessage"
                      ? m.message.extendedTextMessage.text
                      : m.mtype == "buttonsResponseMessage"
                        ? m.message.buttonsResponseMessage.selectedButtonId
                        : m.mtype == "listResponseMessage"
                          ? m.message.listResponseMessage.singleSelectReply
                                .selectedRowId
                          : m.mtype == "templateButtonReplyMessage"
                            ? m.message.templateButtonReplyMessage.selectedId
                            : m.mtype === "messageContextInfo"
                              ? m.message.buttonsResponseMessage
                                    ?.selectedButtonId ||
                                m.message.listResponseMessage?.singleSelectReply
                                    .selectedRowId ||
                                m.text
                              : "";

        var budy = typeof m.text == "string" ? m.text : "";
        // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
        var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
        const isCmd2 = body.startsWith(prefix);
        const command = body
            .replace(prefix, "")
            .trim()
            .split(/ +/)
            .shift()
            .toLowerCase();
        const args = body.trim().split(/ +/).slice(1);
        const pushname = m.pushName || "No Name";
        const botNumber = await client.decodeJid(client.user.id);
        const itsMe = m.sender == botNumber ? true : false;
        const itsOwner = m.sender == owner + "@s.whatsapp.net" ? true : false;

        // Rekam teks seseorang
        let text = (q = args.join(" "));

        const from = m.chat; // Pesan teks masuk
        const reply = m.reply; // Balas pesan
        const sender = m.sender.replace("@s.whatsapp.net", ""); // nomor Whatsapp
        const mek = chatUpdate.messages[0];

        const color = (text, color) => {
            return !color ? chalk.green(text) : chalk.keyword(color)(text);
        };

        // Group
        const groupMetadata = m.isGroup
            ? await client.groupMetadata(m.chat).catch((e) => {})
            : "";
        const groupName = m.isGroup ? groupMetadata.subject : "";

        // Push Message To Console
        let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...` : budy;
        if (isCmd2 && !m.isGroup) {
            console.log(
                chalk.black(chalk.bgWhite("[ LOGS ]")),
                color(argsLog, "turquoise"),
                chalk.magenta("From"),
                chalk.green(pushname),
                chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`),
            );
        } else if (isCmd2 && m.isGroup) {
            console.log(
                chalk.black(chalk.bgWhite("[ LOGS ]")),
                color(argsLog, "turquoise"),
                chalk.magenta("From"),
                chalk.green(pushname),
                chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`),
                chalk.blueBright("IN"),
                chalk.green(groupName),
            );
        }

        if (isCmd2) {
            switch (command) {
                // untuk testing
                case "test":
                    client.sendText(from, "Data anda telah terbaca");
                    console.log(m);
                    break;

                // ABOUT ME
                case "owner":
                    m.reply(introOwner());
                    break;

                //USERS COMMAND
                case "register":
                    if (m.isGroup) {
                        m.reply(
                            "Maaf, command ini tidak bisa dilakukan dalam grup",
                        );
                    } else {
                        // Membuat objek data pengguna baru
                        const { register } = require("./handler/users");
                        register(m, client, owner, sender, text);
                    }
                    break;

                case "logout":
                    const { logout } = require("./handler/users");
                    logout(m, sender);
                    break;
                case "myprofile":
                    const { myprofile } = require("./handler/users");
                    myprofile(m, sender);
                    break;

                //LIHAT LIST MENU
                case "help":
                case "menu":
                    m.reply(help(prefix));
                    break;

                //HANDLER COMMAND UNTUK CHATGPT
                case "ai":
                case "openai":
                    if (checkUser(m)) {
                        chatOpenai(client, prefix, m, command, text, mek);
                        /*
              // Untuk only group
            if (m.isGroup) {
              chatOpenai(client, prefix, m, command, text, mek);
            } else {
              m.reply("Maaf, command ini hanya bisa dilakukan dalam grup");
            }
            */
                    }
                    break;

                case "aitest":
                    if (checkUser(m)) {
                        chatOpenaiTest(client, prefix, m, command, text, mek);
                    }
                    break;

                /*
        // MENCOBA UNTUK KONEKSI AI IMAGE
        case "img":
        case "ai-img":
        case "image":
        case "images":
          if (checkUser(m)) {
            if (m.isGroup) {
              imgOpenai(client, prefix, m, command, text, mek);
            } else {
              m.reply("Maaf, command ini hanya bisa dilakukan dalam grup");
            }
          }
          break;
*/

                // BUAT PENGINGAT TUGAS
                case "buat_tugas":
                    const { createTask } = require("./handler/studentTasks");
                    if (checkUser2(m)) {
                        createTask(m, sender, text);
                        if (m.isGroup) {
                            m.reply(
                                "Maaf, command ini hanya untuk chat pribadi",
                            );
                        } else {
                            createTask(m, sender, text);
                        }
                    }
                    break;

                case "cek_tugas":
                    const { showTask } = require("./handler/studentTasks");
                    if (checkUser2(m)) {
                        showTask(m, sender);
                        if (m.isGroup) {
                            m.reply(
                                "Maaf, command ini hanya untuk chat pribadi",
                            );
                        } else {
                            showTask(m, sender);
                        }
                    }
                    break;

                // BUAT PENGINGAT TUGAS GROUP
                case "buat_tugas_grup":
                    const {
                        createGroupTask,
                    } = require("./handler/studentTasks");
                    if (checkUser2(m)) {
                        if (m.isGroup) {
                            createGroupTask(m, from, text);
                        } else {
                            m.reply(
                                "Maaf, command ini hanya bisa dilakukan dalam grup",
                            );
                        }
                    }
                    break;

                case "cek_tugas_grup":
                    const { showGroupTask } = require("./handler/studentTasks");
                    if (checkUser2(m)) {
                        if (m.isGroup) {
                            showGroupTask(m, from);
                        } else {
                            m.reply(
                                "Maaf, command ini hanya bisa dilakukan dalam grup",
                            );
                        }
                    }
                    break;

                /*
        // KONTAK ADMIN SEKOLAH
        case "kontak_admin":
          m.reply(kontak_admin());
          break;
        */

                // KONTAK STAF SEKOLAH
                case "kontak_staf":
                    if (checkUser2(m)) {
                        // input : m, client, text
                        const { kontakStaf } = require("./handler/kontakStaf");
                        kontakStaf(m, client, text, mek);
                    }
                    break;

                // JADWAL PELAJARAN SEKOLAH
                case "jadwal_pelajaran":
                    if (checkUser2(m)) {
                        try {
                            const filePath = "./files/jadwal_pelajaran.pdf";
                            client.sendDoc(
                                from,
                                filePath,
                                jadwal_pelajaran(),
                                "Jadwal Pelajaran.pdf",
                                mek,
                            );
                        } catch (error) {
                            console.error(error);
                            m.reply(
                                "Maaf, terjadi kesalahan saat mengirim file.",
                            );
                        }
                    }
                    break;

                // INFO EKSKUL SEKOLAH
                case "info_ekskul":
                    if (checkUser2(m)) {
                        try {
                            const filePath = "./files/info_ekskul.pdf";
                            client.sendDoc(
                                from,
                                filePath,
                                info_ekskul(),
                                "Info Ekskul.pdf",
                                mek,
                            );
                        } catch (error) {
                            console.error(error);
                            m.reply(
                                "Maaf, terjadi kesalahan saat mengirim file.",
                            );
                        }
                    }
                    break;

                //TEACHERS COMMAND
                case "mulaiabsen":
                    if (m.isGroup && itsOwner) {
                        // Membuat objek data pengguna baru
                        const { processAbsenCommand } = require("./handler/studentTasks");
                        processAbsenCommand(m, sender);
                    } else {                        
                        m.reply(
                            "Maaf, command ini hanya bisa dilakukan dalam grup oleh owner",
                        );
                    }
                    break;

                case "absen":
                    if (m.isGroup) {
                        // Membuat objek data pengguna baru
                        const { processAbsenSiswa } = require("./handler/studentTasks");
                        processAbsenSiswa(m, sender, text);
                    } else {                        
                        m.reply(
                            "Maaf, command ini hanya bisa dilakukan dalam grup oleh owner",
                        );
                    }
                    break;

                //ONLY OWNER COMMAND

                case "member":
                    if (itsOwner) {
                        const { member } = require("./handler/users");
                        member(m, text, client);
                    } else {
                        m.reply(`Maaf, command ini hanya untuk owner.`);
                    }
                    break;
                case "addpoint":
                    if (itsOwner) {
                        const { addPoint } = require("./handler/users");
                        addPoint(m, text, client);
                    } else {
                        m.reply(`Maaf, command ini hanya untuk owner.`);
                    }
                    break;
                case "kick":
                    if (itsOwner) {
                        const { kick } = require("./handler/users");
                        kick(m, text);
                    } else {
                        m.reply(`Maaf, command ini hanya untuk owner.`);
                    }
                    break;
                case "addstaf":
                    if (itsOwner) {
                        // input : m, text
                        const { addStaf } = require("./handler/kontakStaf");
                        addStaf(m, text);
                    } else {
                        m.reply(`Maaf, command ini hanya untuk owner.`);
                    }
                    break;
                case "delstaf":
                    if (itsOwner) {
                        // input : m, text
                        const { delStaf } = require("./handler/kontakStaf");
                        delStaf(m, text);
                    } else {
                        m.reply(`Maaf, command ini hanya untuk owner.`);
                    }
                    break;

                default: {
                    if (isCmd2 && budy.toLowerCase() != undefined) {
                        if (m.chat.endsWith("broadcast")) return;
                        if (m.isBaileys) return;
                        if (!budy.toLowerCase()) return;
                        if (argsLog || (isCmd2 && !m.isGroup)) {
                            m.reply(
                                `Maaf, command *${prefix}${command}* tidak tersedia`,
                            );
                            // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                            console.log(
                                chalk.black(chalk.bgRed("[ ERROR ]")),
                                color("command", "turquoise"),
                                color(`${prefix}${command}`, "turquoise"),
                                color("tidak tersedia", "turquoise"),
                            );
                        } else if (argsLog || (isCmd2 && m.isGroup)) {
                            m.reply(
                                `Maaf, command *${prefix}${command}* tidak tersedia`,
                            );
                            // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                            console.log(
                                chalk.black(chalk.bgRed("[ ERROR ]")),
                                color("command", "turquoise"),
                                color(`${prefix}${command}`, "turquoise"),
                                color("tidak tersedia", "turquoise"),
                            );
                        }
                    }
                }
            }
        }
    } catch (err) {
        m.reply(util.format(err));
    }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update ${__filename}`));
    delete require.cache[file];
    require(file);
});
