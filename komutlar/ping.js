const Discord = require("discord.js")
const ayarlar = require("../ayarlar.json")



exports.run = async(client, message, args) => {
  if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(
    new Discord.MessageEmbed()
    .setDescription('> Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!')
  ).then(x => x.delete({timeout: 5000}));

    message.channel.send(
        new Discord.MessageEmbed()
        .setDescription(`> Gecikme Süresi: ${client.ws.ping}ms`)
    ).then(x => x.delete({timeout: 5000}));
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['ms'],
    perm: 3
  }
  exports.help = {
    name: 'ping'
  }