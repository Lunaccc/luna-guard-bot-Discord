const Discord = require('discord.js')
const db = require('quick.db')
const ayarlar = require('../ayarlar.json')
 
exports.run = async(client, message, args) => {

let prefix = ayarlar.prefix

  if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription('> Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!')
  ).then(x => x.delete({timeout: 5000}));
  
  if (args[0] === 'aç') {
    db.set(`kanalk_${message.guild.id}`, "Aktif")
       const embed1 = new Discord.MessageEmbed()
    .setDescription(`> Kanal Koruma Başarıyla Açıldı!`)
    .setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
    return message.channel.send(embed1).then(x => x.delete({timeout: 5000}));
  }
   if (args[0] === 'kapat') {
    db.delete(`kanalk_${message.guild.id}`)
       const embed = new Discord.MessageEmbed()
    .setDescription(`> Kanal Koruma Başarıyla Kapatıldı!`)
    .setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
    return message.channel.send(embed).then(x => x.delete({timeout: 5000}));
  }
};
exports.conf = {
  aliases: [],
  permLevel: 0
};
exports.help = {
  name: 'kanalkoruma'
}; 

