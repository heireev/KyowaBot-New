const { Configuration, OpenAIApi } = require("openai");
let keyopenai = process.env['APIKEY']; // ambil id token dari secret

const { intro } = require("../utils/message.js")
const {
    writeDatabase, readDatabase,
} = require("../utils/database.js");

// Simpan kunci API dalam sebuah array
const apiKeys = ["API1","API2","API3","API4","API5"];
let currentApiKeyIndex = 0;

exports.chatOpenaiTest = async (client, prefix, m, command, text, mek) => {
    // Pengecekan apakah pengguna telah terdaftar
    const sender = m.sender.replace("@s.whatsapp.net", ""); // user WA number
    const dbUsersData = readDatabase("users");
    const userData = dbUsersData.find(user => user.number === sender);

    if (!text) return m.reply(`Chat dengan Kyowa-Bot OpenAI.\n\nContoh:\n${prefix}${command} Apa itu bahasa mesin?`);

    try {
        client.sendEmoticon(m.chat, '✅', mek)
        // Kirim hasil ke user terkait
        m.reply(`API yang dieksekusi = ${apiKeys[currentApiKeyIndex]}\n\ninfo: Poin Anda tersisa ${userData.points} kali.`);

        // Kurangi points setelah pengguna menggunakan perintah
        userData.points--;
        const userIndex = dbUsersData.findIndex(user => user.number === sender);
        dbUsersData[userIndex] = userData;
        writeDatabase("users", dbUsersData);

        // Tingkatkan indeks untuk penggunaan berikutnya, kembali ke 0 jika mencapai panjang array
        currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;


    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
            console.log(`${error.response.status}\n\n${error.response.data}`);
        } else {
            console.log(error);
            m.reply("Maaf, sepertinya ada yang error: " + error.message);
        }
    }
}

exports.chatOpenai = async (client, prefix, m, command, text, mek) => {
    // Pengecekan apakah pengguna telah terdaftar
    const sender = m.sender.replace("@s.whatsapp.net", ""); // user WA number
    const dbUsersData = readDatabase("users");
    const userData = dbUsersData.find(user => user.number === sender);

    if (!text) return m.reply(`Chat dengan Kyowa-Bot OpenAI.\n\nContoh:\n${prefix}${command} Apa itu bahasa mesin?`);

    try {
        const configuration = new Configuration({
            apiKey: keyopenai, // id token dari secret
        });
        const openai = new OpenAIApi(configuration);
        let kyowaintro = intro();

        client.sendEmoticon(m.chat, '⏳', mek)
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: kyowaintro + text }],
        });
        client.sendEmoticon(m.chat, '✅', mek)
        // Kirim hasil ke user terkait
        m.reply(`${response.data.choices[0].message.content}\n\ninfo: Poin Anda tersisa ${userData.points} kali.`);

        // Kurangi points setelah pengguna menggunakan perintah
        userData.points--;
        const userIndex = dbUsersData.findIndex(user => user.number === sender);
        dbUsersData[userIndex] = userData;
        writeDatabase("users", dbUsersData);
        

    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
            console.log(`${error.response.status}\n\n${error.response.data}`);
        } else {
            console.log(error);
            m.reply("Maaf, sepertinya ada yang error: " + error.message);
        }
    }
}

/*
exports.imgOpenai = async (client, prefix, m, command, text, mek) => {
    // Pengecekan apakah pengguna telah terdaftar
    const sender = m.sender.replace("@s.whatsapp.net", ""); // user WA number
    const dbUsersData = readDatabase("users");
    const userData = dbUsersData.find(user => user.number === sender);

    if (!text) return m.reply(`Chat dengan Kyowa-Bot OpenAI.\n\nContoh:\n${prefix}${command} Apa itu bahasa mesin?`);
    try {
        client.sendEmoticon(m.chat, '⏳', mek)
        const configuration = new Configuration({
            apiKey: keyopenai, // id token dari secret
        });
        const openai = new OpenAIApi(configuration);

        const response = await openai.createImage({
            prompt: text,
            n: 1,
            size: "512x512",
        });
        // Kurangi points setelah pengguna menggunakan perintah
        userData.points--;
        const userIndex = dbUsersData.findIndex(user => user.number === sender);
        dbUsersData[userIndex] = userData;
        writeDatabase("users", dbUsersData);
        client.sendEmoticon(m.chat, '✅', mek)
        // Kirim hasil ke user terkait
        let caption = `${text}\n\ninfo: points Anda tersisa ${userData.points} kali.`
        client.sendImage(m.chat, response.data.data[0].url, caption, mek);

    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
            console.log(`${error.response.status}\n\n${error.response.data}`);
        } else {
            console.log(error);
            m.reply("Maaf, sepertinya ada yang error: " + error.message);
        }
    }
}
*/
