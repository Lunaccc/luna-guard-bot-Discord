const Discord = require('discord.js');
const db = require('quick.db')
const ayarlar = require('../ayarlar.json')
exports.run = async (client, message, args) => {
  if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(
    new Discord.MessageEmbed()
    .setDescription('> Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!')
).then(x => x.delete({timeout: 5000}));
  
  if (args[0] == 'kapat') {
    db.delete(`capslock_${message.guild.id}`)
    message.channel.send(
      new Discord.MessageEmbed()      
.setDescription(`Capslock engelleme sistemi, kapatıldı!`)
)

  }
 
  if (args[0] == 'aç') {
    db.set(`capslock_${message.guild.id}`, 'acik')
    message.channel.send(
      new Discord.MessageEmbed()
  .setDescription(`> Capslock engelleme sistemi, aktif!`)
    )
  }
};
exports.conf = {
  aliases: [],
  permLevel: 3
};
exports.help = {
  name: 'capsengel',
};