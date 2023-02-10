const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_MESSAGES"))
    return message.reply(
        new Discord.MessageEmbed()
        .setDescription(`> Bu komutu kullanabilmek için "MESAJLARI YÖNET" iznine sahip olmalısın!`)
    )
    .then(m => m.delete({timeout: 5000}));
  if (!args[0] || isNaN(args[0]))
    return message.reply(
        new Discord.MessageEmbed()
        .setDescription(`> Silinecek mesaj miktarını belirtmelisin!`)
        )
        .then(m => m.delete({timeout: 5000}));
  message.delete();
  let sayi = Number(args[0]);
  let silinen = 0;
  for (var i = 0; i < Math.floor(sayi / 100); i++) {
    message.channel.bulkDelete(100).then(r => (silinen += r.size));
    sayi = sayi - 100;
  }
  if (sayi > 0)
    message.channel.bulkDelete(sayi).then(r => (silinen += r.size));
  message.channel.send(
    new Discord.MessageEmbed()
      .setDescription(
        `🗑 | **\`\`${
          args[0]
        }\`\` Adet Mesaj Silindi.**`
      )
  )
  .then(m => m.delete({timeout: 5000}));
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["sil","delete","temizle"],
  permLevel: 2
};

exports.help = {
  name: "sil",
  description: "Belirtilen miktarda mesajı siler.",
  usage: "sil"
};
