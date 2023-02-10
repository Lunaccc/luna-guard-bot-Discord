const db = require('quick.db')
const ayarlar = require("../ayarlar.json");
const Discord = require('discord.js')

 
exports.run = async (bot, message, args) => {
  
  var prefix = ayarlar.prefix
  
   if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(
    new Discord.MessageEmbed()
    .setDescription('> Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!')
   ).then(x => x.delete({timeout: 5000}));
  
 
  if (args[0] == 'aç') {
    db.set(`reklam_${message.guild.id}`, 'acik')
      message.channel.send(
        new Discord.MessageEmbed()
        .setDescription('> Reklam Engel başarıyla açıldı!')
        ).then(x => x.delete({timeout: 5000}));
  }
  if (args[0] == 'kapat') {
    db.delete(`reklam_${message.guild.id}`)
      message.channel.send(
        new Discord.MessageEmbed()
        .setDescription('> Reklam Engel başarıyla kapatıldı!')
      ).then(x => x.delete({timeout: 5000}));
  }
 
};
 
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};
 
exports.help = {
  name: 'reklamengel',
};
