exports.intro = () => {
    return `Kamu adalah Kyowa-Bot yang ditugaskan untuk membantu siswa SMKN 01 Barru dalam menjawab pertanyaan apapun tentang pengetahuan umum.
Ada pertanyaan untukmu :
=> `
}

exports.introOwner = () => {
    return `Halo. Saya M. Rifqi Irawan.
Mahasiswa Universitas Negeri Makassar
Jurusan Teknik Informatika dan Komputer

Sebagai pemilik dari *Kyowa-Bot SMEKSA*
Jangan sungkan untuk menghubungi saya untuk informasi lebih lanjut

email : mrifqiirawan.unm@gmail.com`
}


exports.help = (prefix) => {
    return `╭───「 *Kyowa-Bot Command* 」* 
│
├ • *${prefix}owner* -> lihat tentang ku
│
├──「 Akses Chat GPT 」
├ • *${prefix}ai*
│
├──「 Jadwalkan Tugas Anda 」
├ • *${prefix}buat_tugas*
├ • *${prefix}cek_tugas*
├ • *${prefix}buat_tugas_grup*
├ • *${prefix}cek_tugas_grup*
│
├──「 Info SMKN 01 Barru 」
├ • *${prefix}kontak_staf*
├ • *${prefix}jadwal_pelajaran*
│
├──「 Account 」
├ • *${prefix}register*
├ • *${prefix}myprofile*
├ • *${prefix}logout*
│
╰───「 Kyowa Bot 」`
}

exports.jadwal_pelajaran = () => {
    return `📅 Jadwal Pelajaran SMKN 01 BARRU, update untuk
Tahun Akademik  : 2023/2024
Semester        : Ganjil

[file terlampir]

Jika Anda memiliki pertanyaan lebih lanjut tentang jadwal pelajaran atau kegiatan sekolah lainnya, jangan ragu untuk bertanya kepada staf atau guru kami.

Terima kasih.

- Kyowa Bot`
}