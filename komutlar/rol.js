const Discord = require('discord.js')
const db = require('quick.db')
const ayarlar = require('../ayarlar.json')
 
exports.run = async(client, message, args) => {
  
if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(
  new Discord.MessageEmbed()
    .setDescription('> Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!')
).then(x => x.delete({timeout: 5000}));
  
let prefix = ayarlar.prefix

  if (args[0] === 'aç') {
    db.set(`rolk_${message.guild.id}`, "Aktif")
     message.channel.send(
      new Discord.MessageEmbed()
        .setDescription('> Rol Koruma Başarı İle Açıdı!')
     ).then(x => x.delete({timeout: 5000}));
  }
   if (args[0] === 'kapat') {
    db.delete(`rolk_${message.guild.id}`)
    message.channel.send(
        new Discord.MessageEmbed()
        .setDescription('> Rol Koruma Başarı İle Kapandı!')
    ).then(x => x.delete({timeout: 5000}));
  }
};
exports.conf = {
  aliases: [],
  permLevel: 0
};
exports.help = {
  name: 'rolkoruma'
}; 

