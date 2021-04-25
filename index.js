const Discord = require('discord.js');
const tmi = require('tmi.js');
const keepAlive = require('./server');
const { SlashCreator, GatewayServer } = require('slash-create');
const path = require("path")

const dclient = new Discord.Client();
const tclient = new tmi.Client({
	options: { debug: true },
	connection: { reconnect: true },
	identity: {
		username: 'actuallyaboat',
		password: process.env.TWITCH_IRC_TOKEN
	},
	channels: [ '77zephyr' ]
});

tclient.connect();

dclient.once('ready', () => {
	console.log('discord ready');
});


const webhookClient = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);

tclient.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;
  if (!channel === "#77zephyr") return;
  if (tags["message-type"] != "chat") return;
  console.log(`${tags["display-name"]} | ${message}`);
    const embed = new Discord.MessageEmbed()
      .setTitle(tags['display-name'])
      .setDescription(message)
    webhookClient.send('New message from twitch', {
	    username: 'twitch bridge',
	    embeds: [embed],
    });

});

dclient.on('message', message => {
	if (message.author.id == dclient.user.id) return;
  if (message.webhookID) return;

  if (message.guild.id === "789384477335748668") {
    if (message.channel.id == "835711648647348244") {
      tclient.say("77zephyr", `Discord -> ${message.author.tag} | ${message.content}`);
    }
  }

  if (message.content == "ttv.ping") {
    message.channel.send(`Pong! ${dclient.ws.ping}`);
  }

});

keepAlive();
dclient.login(process.env.DISCORD_TOKEN);
