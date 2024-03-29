const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./ayarlar.json");
const chalk = require("chalk");
const fs = require("fs");
const moment = require("moment");
const Jimp = require("jimp");
const db = require("quick.db");
var prefix = config.prefix;
require("./util/eventLoader")(client);

const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};




client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (config.sahip.includes(message.author.id)) permlvl = 4;
  return permlvl;
};
//log sistem bas
//Kanal Silme
client.on("channelDelete", async channel => {
  let modlog = await db.fetch(`log_${channel.guild.id}`);

  if (!modlog) return;
    const yılmaz = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_DELETE" })
    .then(audit => audit.entries.first());
    var embed = new Discord.MessageEmbed()
    .setTitle(`${config.isim} | Denetim Kaydı.`)
    .addField(`> Kanalı Silen Kişi:`,` <@${yılmaz.executor.id}>`)
    .addField(`> Silinen Kanalın Adı: `,`${channel.name}`)
    .setFooter(`${config.isim} Log Sistemi | `) 
    .setTimestamp() 
    return client.channels.cache.get(modlog).send(embed)
  });
//Yeni Kanal Oluşturma
  client.on("channelCreate", async channel => {
    let modlog = await db.fetch(`log_${channel.guild.id}`);

    if (!modlog) return;
    const yılmaz = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_CREATE" })
    .then(audit => audit.entries.first());
    var embed = new Discord.MessageEmbed()
    .setTitle(`${config.isim} | Denetim Kaydı.`)
    .addField(`> Kanalı Oluşturan Kişi:`,` <@${yılmaz.executor.id}>`)
    .addField(`> Oluşturduğu Kanal: `,`<#${channel.id}>`)
    .setFooter(`${config.isim} Log Sistemi | `) 
    .setTimestamp() 
    return client.channels.cache.get(modlog).send(embed)
  });
//Kanal Ayarlarını Yenileme
  client.on("channelUpdate", async oldChannel => {
    let modlog = await db.fetch(`log_${oldChannel.guild.id}`);

    if (!modlog) return;
    const yılmaz = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_UPDATE" })
    .then(audit => audit.entries.first());
    var embed = new Discord.MessageEmbed()
    .setTitle(`${config.isim} | Denetim Kaydı.`)
    .addField(`> Kanalı Yeniliyen Kişi:`,` <@${yılmaz.executor.id}>`)
    .addField(`> Yenilik Gelen kanal: `,`<#${oldChannel.id}>`)
    .setFooter(`${config.isim} Log Sistemi | `) 
    .setTimestamp() 
    return client.channels.cache.get(modlog).send(embed)
});
//mesaj silme
client.on("messageDelete", async message => {
  let modlog = await db.fetch(`log_${message.guild.id}`);

  if (!modlog) return;
  const yılmaz = message
  var embed = new Discord.MessageEmbed()
  .setTitle(`${config.isim} | Denetim Kaydı.`)
  .addField(`> Mesajı Silin Kişi:`,` <@${yılmaz.author.id}>`)
  .addField(`> Mesajı Silindiği Kanal:`,` <#${message.channel.id}>`)
  .addField(`> Silinen Mesaj: `,`${message}`)
  .setFooter(`${config.isim} Log Sistemi | `) 
  .setTimestamp() 
  return client.channels.cache.get(modlog).send(embed)
});
//mesaj yenileme
client.on("messageUpdate", async (oldmessage,newmessage) => {
  let modlog = await db.fetch(`log_${oldmessage.guild.id}`);

  if (!modlog) return;
  const yılmaz = oldmessage
  var embed = new Discord.MessageEmbed()
  .setTitle(`${config.isim} | Denetim Kaydı.`)
  .addField(`> Mesajı Yeniliyen Kişi:`,` <@${yılmaz.author.id}>`)
  .addField(`> Mesajın Yenilendiği Kanal:`,` <#${oldmessage.channel.id}>`)
  .addField(`> Eski Mesaj: `,`${oldmessage}`)
  .addField(`> Yeni Mesaj: `,`${newmessage}`)
  .setFooter(`${config.isim} Log Sistemi | `) 
  .setTimestamp() 
  return client.channels.cache.get(modlog).send(embed)
});
  //emoji oluşturma 
  client.on("emojiCreate", async emoji => {
    let modlog = await db.fetch(`log_${emoji.guild.id}`);

    if (!modlog) return;
    const yılmaz = await await emoji.guild
    .fetchAuditLogs({ type: "EMOJI_CREATE" })
    .then(audit => audit.entries.first());
    var embed = new Discord.MessageEmbed()
    .setTitle(`${config.isim} | Denetim Kaydı.`)
    .addField(`> Emojiyi Oluşturan Kişi:`,` <@${yılmaz.executor.id}>`)
    .addField(`> Oluşturulan Emoji: `,`${emoji}`)
    .setFooter(`${config.isim} Log Sistemi | `) 
    .setTimestamp() 
    return client.channels.cache.get(modlog).send(embed)
  });
  //emoji silme
  client.on("emojiDelete", async emoji => {
    let modlog = await db.fetch(`log_${emoji.guild.id}`);

    if (!modlog) return;
    const yılmaz = await await emoji.guild
    .fetchAuditLogs({ type: "EMOJI_DELETE" })
    .then(audit => audit.entries.first());
    var embed = new Discord.MessageEmbed()
    .setTitle(`${config.isim} | Denetim Kaydı.`)
    .addField(`> Emojiyi Silen Kişi:`,` <@${yılmaz.executor.id}>`)
    .addField(`> Silinen Emoji: `,`${emoji}`)
    .setFooter(`${config.isim} Log Sistemi | `) 
    .setTimestamp() 
    return client.channels.cache.get(modlog).send(embed)
  });
  //emoji yenileme
    client.on("emojiUpdate", async (oldemoji,newemoji) => {
      let modlog = await db.fetch(`log_${oldemoji.guild.id}`);

      if (!modlog) return;
      const yılmaz = await oldemoji.guild
      .fetchAuditLogs({ type: "EMOJI_UPDATE" })
      .then(audit => audit.entries.first());
      var embed = new Discord.MessageEmbed()
      .setTitle(`${config.isim} | Denetim Kaydı.`)
      .addField(`> Emojiyi Yeniniliyen Kişi:`,` <@${yılmaz.executor.id}>`)
      .addField(`> Eski Emoji: `,`${oldemoji} \n > Eski İsmi: ${oldemoji.name}`)
      .addField(`> Yeni Emoji: `,`${newemoji} \n > Yeni İsmi: ${newemoji.name}`)
      .setFooter(`${config.isim} Log Sistemi | `) 
      .setTimestamp() 
      return client.channels.cache.get(modlog).send(embed)
    });
    //banlama
    client.on("guildBanAdd", async (guild,user) => {
      let modlog = await db.fetch(`log_${guild.id}`);

      if (!modlog) return;
      const yılmaz = await guild
      .fetchAuditLogs({ type: "MEMBER_BAN_ADD"})
      .then(audit => audit.entries.first());
      var embed = new Discord.MessageEmbed()
      .setTitle(`${config.isim} | Denetim Kaydı.`)
      .addField(`> Banlayan Yetkili:`,` <@${yılmaz.executor.id}>`)
      .addField(`> Banlanan Üye: `,`<@${user.id}>`)
      .addField(`> Ban Sebebi: `,`${yılmaz.reason}`)
      .setFooter(`${config.isim} Log Sistemi | `) 
      .setTimestamp() 
      return client.channels.cache.get(modlog).send(embed)
    });
    //ban kaldırma
    client.on("guildBanRemove", async (guild,user) => {
      let modlog = await db.fetch(`log_${guild.id}`);

      if (!modlog) return;
      const yılmaz = await guild
      .fetchAuditLogs({ type: "MEMBER_BAN_REMOVE"})
      .then(audit => audit.entries.first());
      var embed = new Discord.MessageEmbed()
      .setTitle(`${config.isim} | Denetim Kaydı.`)
      .addField(`> Banı Kaldıran Yetkili:`,` <@${yılmaz.executor.id}>`)
      .addField(`> Banı Kalkan Üye: `,`<@${user.id}>`)
      .setFooter(`${config.isim} Log Sistemi | `) 
      .setTimestamp() 
      return client.channels.cache.get(modlog).send(embed)
    });
//rol oluşrurma
client.on("roleCreate", async role => {
  let modlog = await db.fetch(`log_${role.guild.id}`);

  if (!modlog) return;
  const yılmaz = await role.guild
  .fetchAuditLogs({ type: "ROLE_CREATE"})
  .then(audit => audit.entries.first());
  var embed = new Discord.MessageEmbed()
  .setTitle(`${config.isim} | Denetim Kaydı.`)
  .addField(`> Rolü Oluşturan Kişi:`,` <@${yılmaz.executor.id}>`)
  .addField(`> Oluşturulan Rol: `,`${role.name}`)
  .setFooter(`${config.isim} Log Sistemi | `) 
  .setTimestamp() 
  return client.channels.cache.get(modlog).send(embed)
});
//rol silme
client.on("roleDelete", async role => {
  let modlog = await db.fetch(`log_${role.guild.id}`);

  if (!modlog) return;
  const yılmaz = await role.guild
  .fetchAuditLogs({ type: "ROLE_DELETE"})
  .then(audit => audit.entries.first());
  var embed = new Discord.MessageEmbed()
  .setTitle(`${config.isim} | Denetim Kaydı.`)
  .addField(`> Rolü Silen Kişi:`,` <@${yılmaz.executor.id}>`)
  .addField(`> Silinen Rol İsmi: `,`${role.name}`)
  .setFooter(`${config.isim} Log Sistemi | `) 
  .setTimestamp() 
  return client.channels.cache.get(modlog).send(embed)
});
//rol yenileme
client.on("roleUpdate", async (oldrole,nrole) => {
  let modlog = await db.fetch(`log_${oldrole.guild.id}`);

  if (!modlog) return;
  const yılmaz = await oldrole.guild
  .fetchAuditLogs({ type: "ROLE_UPDATE"})
  .then(audit => audit.entries.first());
  var embed = new Discord.MessageEmbed()
  .setTitle(`${config.isim} | Denetim Kaydı.`)
  .addField(`> Rolü Yenileyen Kişi:`,` <@${yılmaz.executor.id}>`)
  .addField(`> Eski İsmi: `,`${oldrole.name}`)
  .addField(`> Yeni İsmi: `,`${nrole.name}`)
  .addField(`> Açıklama: `,`İsim Aynı İse Yetkisi İle Oynanmıştır.`)
  .setFooter(`${config.isim} Log Sistemi | `) 
  .setTimestamp() 
  return client.channels.cache.get(modlog).send(embed)
});
//log sistem son
//caps engel
client.on("message", async msg => {
  if (msg.channel.type === "dm") return;
    if(msg.author.bot) return;  
      if (msg.content.length > 4) {
       if (db.fetch(`capslock_${msg.guild.id}`)) {
         let caps = msg.content.toUpperCase()
         if (msg.content == caps) {
           if (!msg.member.hasPermission("ADMINISTRATOR")) {
             if (!msg.mentions.users.first()) {
               msg.delete()
               return msg.channel.send(
                 new Discord.MessageEmbed()
                 .setDescription(`${msg.author}, Bu sunucuda, büyük harf kullanımı engellenmekte!`)
               ).then(m => m.delete(5000))
   }
     }
   }
 }
}
});

//everhereengel
client.on("message", async msg => {
let hereengelle = await db.fetch(`guardeh_${msg.guild.id}`);
if (hereengelle == "acik") {
  const here = ["@here", "@everyone"];
  if (here.some(word => msg.content.toLowerCase().includes(word))) {
    if (!msg.member.permissions.has("ADMINISTRATOR")) {
      msg.delete();
      return msg.hannel.send(
        new Discord.MessageEmbed()
                .setDescription(`> ${message.author} Genel Etiket Atmak Yasak!`)
      ).then(luffyy => luffyy.delete({ timeout: 5000 }));
    }
  }
} else if (hereengelle == "kapali") {
}
});

//REKLAMENGEL

client.on("message", msg => {
if(!db.has(`reklam_${msg.guild.id}`)) return;
      const reklam = [".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", "net", ".rf.gd", ".az", ".party", "discord.gg",];
      if (reklam.some(word => msg.content.includes(word))) {
        try {
          if (!msg.member.hasPermission("ADMİNİSTRATOR")) {
                msg.delete();
                  return msg.reply(
                    new Discord.MessageEmbed()
                .setDescription(`${message.author} Bu Sunucuda Reklam Yapmak Yasak!`)
                  ).then(msg => msg.delete(3000));
 

msg.delete(3000);                              

          }              
        } catch(err) {
          console.log(err);
        }
      }
  });

//rolkoruma//
client.on("roleDelete", async role => {
let rolkoruma = await db.fetch(`rolk_${role.guild.id}`);
if (rolkoruma) { 
       const entry = await role.guild.fetchAuditLogs({ type: "ROLE_DELETE" }).then(audit => audit.entries.first());
  if (entry.executor.id == client.user.id) return;
role.guild.roles.create({ data: {
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        permissions: role.permissions,
        mentionable: role.mentionable,
        position: role.position
}, reason: '> Silinen Roller Tekrar Açıldı.'})
}
})

//

client.on("roleCreate", async role => {
let rolkorumaa = await db.fetch(`rolk_${role.guild.id}`);
if (rolkorumaa) { 
     const entry = await role.guild.fetchAuditLogs({ type: "ROLE_CREATE" }).then(audit => audit.entries.first());
  if (entry.executor.id == client.user.id) return;
role.delete()
}
})


//kanalkoruma//
client.on("channelDelete", async function(channel) {
let rol = await db.fetch(`kanalk_${channel.guild.id}`);

if (rol) {
  const guild = channel.guild.cache;
  let channelp = channel.parentID;

  channel.clone().then(z => {
    let kanal = z.guild.channels.find(c => c.name === z.name);
    kanal.setParent(
      kanal.guild.channels.find(channel => channel.id === channelp)
    );
  });
}
});


//küfürengel

client.on("message", message => {
  const i = db.fetch(`küfür_${message.guild.id}`)
    if (i) {
        const kufur = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "mal", "sik", "yarrak", "am", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq","31"];
        if (kufur.some(word => message.content.includes(word))) {
          try {
            if (!message.member.hasPermission("BAN_MEMBERS")) {
              message.delete();
                         
                      return message.reply(
                        new Discord.MessageEmbed()
                        .setDescription(`> ${message.author} Bu Sunucuda Küfür Yasak!`)
                      ).then(message => message.delete(3000));
            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
    if (!i) return;
  });

client.login(config.token);