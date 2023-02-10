const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("../ayarlar.json");

exports.run = async (client, message, args) => {
 
  let prefix = ayarlar.prefix;
  if (!message.member.hasPermission("ADMINISTRATOR"))return message.channel.send(
    new Discord.MessageEmbed()
    .setDescription('> Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!')
    ).then(x => x.delete({timeout: 5000}));

  let logk = message.mentions.channels.first();
  let logkanal = await db.fetch(`log_${message.guild.id}`);

  if (args[0] === "sıfırla" || args[0] === "kapat") {
    db.delete(`log_${message.guild.id}`);
    message.channel.send(
      new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setDescription(
          `> Mod-log kanalı başarıyla sıfırlandı.`
        )
    ).then(x => x.delete({timeout: 5000}));
    return;
  }
  db.set(`log_${message.guild.id}`, logk.id);
  message.channel.send(
    new Discord.MessageEmbed()
      .setColor("#ff0000")
      .setDescription(`> Mod-log kanalı başarıyla ${logk} olarak ayarlandı.`)
  ).then(x => x.delete({timeout: 5000}));
};

exports.conf = {
  aliases: [],
  permLevel: 0
};
exports.help = {
  name: 'mod-log'
}; 
