const { Client, MessageEmbed } = require('discord.js');
function info(message) {

  try{

  if(!message.mentions.users.size) {

    const embed = new MessageEmbed()
    .setTitle('vos stats :')
    .setColor(0xffe402)
    .setThumbnail(message.author.avatarURL)
    .addField(
      "Pseudo : ",message.author.username
    ).addField(
      "En ligne : ", message.author.presence.status, true
    ).addField(
      "ID", message.author.id, true
    ).addField(
      "Jeux : ", message.author.presence.game, true
    ).addField(
      "Compte créé le : ", message.author.createdAt, true
    );
    message.channel.send(embed);
    return

  }

  var user = message.mentions.users.first();

  const embed2 = new RichEmbed()
  .setTitle('les stats de ' + user.username + ' :')
  .setColor(0xffe402)
  .setThumbnail(user.avatarURL)
  .addField(
    "Pseudo : ", user.username
  ).addField(
    "En ligne : ", user.presence.status, true
  ).addField(
    "ID", user.id, true
  ).addField(
    "Jeux : ", user.presence.game, true
  ).addField(
    "Compte créé le : ", user.createdAt, true
  );
  message.channel.send(embed2);

}catch(err) {

  console.log(err);

}

}

module.exports = info;
