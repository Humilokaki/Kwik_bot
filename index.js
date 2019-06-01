const { Client, RichEmbed, Util} = require('discord.js');
const YouTube = require('simple-youtube-api');
const config = require('./config.json');
const ytdl = require('ytdl-core-discord');
const fs = require("fs");

const client = new Client();

const youtube = new YouTube(process.env.GOOGLE_API_KEY);
const queue = new Map();


client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => {
    console.log('Le bot est démarré !');
		client.user.setActivity("Aduler Loomy");

});

client.on('message', async message => {
    if (message.author.bot) return undefined;
    //if (!message.content.startsWith(config.prefix)) return undefined;

    const args = message.content.split(' ');
    const searchString = args.slice(1).join(' ');
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(message.guild.id);

    //fun

    if (message.content === prefixVerifier(message) + 'ping') {
			message.channel.send("pong");
			return;

  	}

		if(message.content === prefixVerifier(message) + 'help') {

      const help = require('./command/fun/help.js');
      help(message);

			return;

		}

    if(message.content.startsWith(prefixVerifier(message) + 'info')) {

      const info = require('./command/fun/info.js');
      info(message);

      return;

    }

    //moderation

    if(message.content.startsWith(prefixVerifier(message) + "log")) {

      const log = require('./command/moderation/log.js');
      log(message);

      return;

    }

    if(message.content.startsWith(prefixVerifier(message) + "prefix")) {

      const prefix = require('./command/moderation/prefix.js');
      prefix(message);

      return;

    }

    if(message.content.startsWith(prefixVerifier(message) + "musicchannel")) {

      const musicchannel = require('./command/music/musicchannel.js');
      musicchannel(message);

      return;

    }

    if(message.content.startsWith(prefixVerifier(message) + "welcome")) {

      const welcome = require('./command/moderation/welcome.js');
      welcome(message);

      return;

    }

		if (message.content.startsWith(prefixVerifier(message) + 'kick')) {

      const kick = require('./command/moderation/kick.js');
			kick(message);

			return;
		}

		if (message.content.startsWith(prefixVerifier(message) + 'ban')) {

      const ban = require('./command/moderation/ban.js');
			ban(message);

			return;
		}

    var regexpunban = new RegExp('^\\' + prefixVerifier(message) + 'unban\\s+([^\\s]*)$');
		if (regexpunban.test(message.content)) {

      var id = message.content.replace(regexpunban, "$1");

      const unban = require('./command/moderation/unban.js');
			unban(message, id);

			return;
		}

    //apex

		var regexp = new RegExp('^\\' + prefixVerifier(message) + 'apex\\s+stats\\s+([^\\s]*)\\s+([^\\s]*)$');
		if(regexp.test(message.content)) {

			var user = message.content.replace(regexp, "$1");
			var platform = message.content.replace(regexp, "$2");

      const stats = require('./command/apex/stats.js');
			stats(message,user,platform);

			//curl https://public-api.tracker.gg/apex/v1/standard/profile/5/GAb_3511 -H "TRN-API-KEY: 29dd5302-c7ea-4c2c-8b5e-b7858844d8b4"

      return;
		}

		var regexp2 = new RegExp('^\\' + prefixVerifier(message) + 'apex\\s+legend\\s+([^\\s]*)$');
		if(regexp2.test(message.content)) {
			var legend = message.content.replace(regexp2, "$1");

      const legends = require('./command/apex/legend.js');
      legends(message,legend);


		}

    //musics

    if(message.content.startsWith(prefixVerifier(message) + 'play')) {

      if(!message.guild) return undefined;

      try {
        let music = JSON.parse(fs.readFileSync("./musicchannel.json", "utf8"));
        if (music[message.guild.id].musicchannel) {
          var musicchannel = message.guild.channels.find(channel => channel.id === music[channel.guild.id].musicchannel);

          if (!musicchannel) return undefined;
          if (music[message.guild.id].musicchannel != message.channels.id) return undefined;

        /*const play = require('./command/music/play.js');
  			play(message);*/

        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) {
          return message.channel.send('je suis désolé mais vous n\'êtes pas dans un salon vocal');
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) {
      			return message.channel.send('je ne peux pas me connecter dans votre salon vocal !');
        }
        if (!permissions.has('SPEAK')) {
      			return message.channel.send('je ne peux pas parler dans votre salon vocal !');
        }
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      			const playlist = await youtube.getPlaylist(url);
      			const videos = await playlist.getVideos();
      			for (const video of Object.values(videos)) {
      				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
      				await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
      			}
      			return message.channel.send(`✅ Playlist: **${playlist.title}** a bien été ajouté à la playlist!`);
        }
        else {
      			try {
      				var video = await youtube.getVideo(url);
      			} catch (error) {
      				try {
      					var videos = await youtube.searchVideos(searchString, 10);
      					let index = 0;
      					message.channel.send(`
      __**Song selection:**__
      ${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
      Please provide a value to select one of the search results ranging from 1-10.
      					`);
      					// eslint-disable-next-line max-depth
      					try {
      						var response = await message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
      							maxMatches: 1,
      							time: 10000,
      							errors: ['time']
      						});
      					} catch (err) {
      						console.error(err);
      						return message.channel.send('résultat absent ou invalide, annulation de la sélection musicale.');
      					}
      					const videoIndex = parseInt(response.first().content);
      					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
      				} catch (err) {
      					console.error(err);
      					return message.channel.send('🆘 Je n\'ai pas trouvé de résultats.');
      				}
      			}
      			return handleVideo(video, message, voiceChannel);
          }

  			return;
      }
    }catch(err) {console.log(err)}

		}

    if(message.content.startsWith(prefixVerifier(message) + 'skip')) {

      if(!message.guild) return undefined;

      try {
        let music = JSON.parse(fs.readFileSync("./musicchannel.json", "utf8"));
        if (music[member.guild.id].musicchannel) {
          var musicchannel = member.guild.channels.find(channel => channel.id === music[channel.guild.id].musicchannel);

          if (!musicchannel) return undefined;
          if (music[message.guild.id].musicchannel != message.channels.id) return undefined;

          if (!message.member.voiceChannel) return message.channel.send('vous n\'êtes pas dans un salon vocal !');
          if (!serverQueue) return message.channel.send('Je ne peut pas skip cette musique.');
          serverQueue.connection.dispatcher.end('musique skip !');

        }
      }catch(err) {}

			return;

		}

    if(message.content.startsWith(prefixVerifier(message) + 'stop')) {

      if(!message.guild) return undefined;

      try {
        let music = JSON.parse(fs.readFileSync("./musicchannel.json", "utf8"));
        if (music[message.guild.id].musicchannel) {
          var musicchannel = message.guild.channels.find(channel => channel.id === music[channel.guild.id].musicchannel);

          if (!musicchannel) return undefined;
          if (music[message.guild.id].musicchannel != message.channels.id) return undefined;


          if (!message.member.voiceChannel) return message.channel.send('vous n\'êtes pas dans un salon vocal !');
      		if (!serverQueue) return message.channel.send('Je suis déjâ stoppé.');
      		serverQueue.songs = [];
          serverQueue.connection.dispatcher.end('La command stop a bien été utilisé !');
          return message.channel.send('j\'ai quitté le salon vocal');

        }
      }catch(err) {}
		}

    if(message.content.startsWith(prefixVerifier(message) + 'volume')) {

      if(!message.guild) return undefined;

      try {
        let music = JSON.parse(fs.readFileSync("./musicchannel.json", "utf8"));
        if (music[message.guild.id].musicchannel) {
          var musicchannel = message.guild.channels.find(channel => channel.id === music[channel.guild.id].musicchannel);

          if (!musicchannel) return undefined;
          if (music[message.guild.id].musicchannel != message.channels.id) return undefined;

          if (!message.member.voiceChannel) return message.channel.send('Vous n\'êtes pas dans un salon vocal!');
    		  if (!serverQueue) return message.channel.send('Il n\'y a rien a joué');
    		  if (!args[1]) return message.channel.send(`Le volume est actuellement à : **${serverQueue.volume}**`);
          serverQueue.volume = args[1];
          serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
          return message.channel.send(`J'ai mis le volume à : **${args[1]}**`);

        }
      }catch(err) {}

    }

    if(message.content.startsWith(prefixVerifier(message) + "np")) {

      if(!message.guild) return undefined;

      try {
        let music = JSON.parse(fs.readFileSync("./musicchannel.json", "utf8"));
        if (music[message.guild.id].musicchannel) {
          var musicchannel = message.guild.channels.find(channel => channel.id === music[channel.guild.id].musicchannel);

          if (!musicchannel) return undefined;
          if (music[message.guild.id].musicchannel != message.channels.id) return undefined;

        if (!serverQueue) return message.channel.send("Il n\'y a rien de joué");
        return message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);

        }
      }catch(err) {}
    }

    if(message.content.startsWith(prefixVerifier(message) + "playlist")) {

      if(!message.guild) return undefined;

      try {
        let music = JSON.parse(fs.readFileSync("./musicchannel.json", "utf8"));
        if (music[message.guild.id].musicchannel) {
          var musicchannel = message.guild.channels.find(channel => channel.id === music[channel.guild.id].musicchannel);

          if (!musicchannel) return undefined;
          if (music[message.guild.id].musicchannel != message.channels.id) return undefined;

          if (!serverQueue) return message.channel.send("Il n\'y a rien à joué.");
          return message.channel.send(`
    __**Playlist :**__
    ${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
    **Now playing:** ${serverQueue.songs[0].title}
    		`);

        }
      }catch(err) {}

    }

    if(message.content.startsWith(prefixVerifier(message) + "pause")) {

      if(!message.guild) return undefined;

      try {
        let music = JSON.parse(fs.readFileSync("./musicchannel.json", "utf8"));
        if (music[message.guild.id].musicchannel) {
          var musicchannel = message.guild.channels.find(channel => channel.id === music[channel.guild.id].musicchannel);

          if (!musicchannel) return undefined;
          if (music[message.guild.id].musicchannel != message.channels.id) return undefined;

          if (serverQueue && serverQueue.playing) {
    			   serverQueue.playing = false;
    			   serverQueue.connection.dispatcher.pause();
    			   return message.channel.send('⏸ musique mis en Pause !');
    		  }
          return message.channel.send('Il n\'a rien de joué.');

        }
      }catch(err) {}
    }

    if(message.content.startsWith(prefixVerifier(message) + "resume")) {

      if(!message.guild) return undefined;

      try {
        let music = JSON.parse(fs.readFileSync("./musicchannel.json", "utf8"));
        if (music[message.guild.id].musicchannel) {
          var musicchannel = message.guild.channels.find(channel => channel.id === music[channel.guild.id].musicchannel);

          if (!musicchannel) return undefined;
          if (music[message.guild.id].musicchannel != message.channels.id) return undefined;


          if (serverQueue && !serverQueue.playing) {
    			   serverQueue.playing = true;
    			   serverQueue.connection.dispatcher.resume();
    			   return message.channel.send('▶ musique joué !');
          }
          return message.channel.send("Il n\'y a rien de joué");

        }
      }catch(err) {}
    }

});

client.on('guildMemberAdd', member => {
  if(!member.guild) return undefined;

  try {
    let welcome = JSON.parse(fs.readFileSync("./welcome.json", "utf8"));
    if (welcome[member.guild.id].channel) {
      var welcomechannel  = member.guild.channels.find(channel => channel.id === welcome[channel.guild.id].channel);

      if (!welcomechannel) return undefined;
      welcomechannel.send(welcome[member.guild.id].message + ` ${member}`);
    }
  }catch(err) {}
});

client.on('channelCreate', channel => {
  if(!channel.guild) return undefined;


  try {
    let logs = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
    if (logs[channel.guild.id].toggle === 1) {
    	var logchannel  = channel.guild.channels.find(channel => channel.name === "logs");
      if(!logchannel ) return undefined;

    	const embed = new RichEmbed()
    		.setTitle('log :')
    		.setColor(0xffe402)
    		.setDescription(
    			"salon créé : " +
    			channel.name
    		);

  	   logchannel.send(embed);
    }
  }catch(err) {}

});

client.on('channelDelete', channel => {
  if(!channel.guild) return undefined;

  try {
    let logs = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
    if (logs[channel.guild.id].toggle === 1) {
    	var log = channel.guild.channels.find(channel => channel.name === "logs");
      if(!log) return undefined;

    	const embed = new RichEmbed()
    		.setTitle('log :')
    		.setColor(0xffe402)
    		.setDescription(
    			"salon supprimé : " +
    			channel.name
    		);

    	log.send(embed);
    }
  }catch(err) {}
});

client.on('emojiCreate', emoji => {
  if(!emoji.guild) return undefined;

  try {
    let logs = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
    if (logs[emoji.guild.id].toggle === 1) {
    	var log = emoji.guild.channels.find(channel => channel.name === "logs");
      if(!log) return undefined;

    	const embed = new RichEmbed()
    		.setTitle('log :')
    		.setColor(0xffe402)
    		.setThumbnail(emoji.url)
    		.setDescription(
    			"émoji créé : " +
    			emoji.name
    		);

    	log.send(embed);
    }
  }catch(err) {}
});

client.on('emojiDelete', emoji => {
  if(!emoji.guild) return undefined;


  try {
    let logs = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
    if (logs[emoji.guild.id].toggle === 1) {
    	var log = emoji.guild.channels.find(channel => channel.name === "logs");
      if(!log) return undefined;

    	const embed = new RichEmbed()
    		.setTitle('log :')
    		.setColor(0xffe402)
    		.setThumbnail(emoji.url)
    		.setDescription(
    			"émoji supprimé : " +
    			emoji.name
    		);

    	log.send(embed);
    }
  }catch(err) {}
});

/*client.on('guildBanAdd', ban => {
	var log = ban.guild.channels.find(channel => channel.name === "log");
  if(!log) return undefined;

	const embed = new RichEmbed()
		.setTitle('log :')
		.setColor(0xffe402)
		.setDescription(
			"membre banni : " +
			ban.user.username
		);

	log.send(embed);
});

client.on('guildBanRemove', unban => {
	var log = unban.guild.channels.find(channel => channel.name === "log");
  if(!log) return undefined;

	const embed = new RichEmbed()
		.setTitle('log :')
		.setColor(0xffe402)
		.setDescription(
			"membre unban : " +
			unban.user.username
		);

	log.send(embed);
});*/

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 4,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`je ne peux pas rejoindre le salon vocal: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`je ne peux pas rejoindre le salon vocal: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		if (playlist) return undefined;
		else return msg.channel.send(`✅ **${song.title}** a été ajouté à la playlist!`);
	}
	return undefined;
}

async function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}


	//const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
  const dispatcher = serverQueue.connection.playOpusStream(await ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
}

function prefixVerifier(message) {

  try {
    let prefix = JSON.parse(fs.readFileSync("./prefix.json", "utf8"));
    return prefix[message.guild.id].prefix;
  }catch(err) {
    return config.prefix;
  }

}



client.login(process.env.DISCORD_TOKEN);
