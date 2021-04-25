const Discord = require('discord.js');
const tmi = require('tmi.js');
const keepAlive = require('./server');
const fetch = require('node-fetch');
require("dotenv").config()

const dclient = new Discord.Client();
const tclient = new tmi.Client({
	options: { debug: true },
	connection: { reconnect: true },
	identity: {
		username: process.env.TWITCH_USERNAME,
		password: process.env.TWITCH_IRC_TOKEN
	},
	channels: [ process.env.TWITCH_CHANNEL_NAME ]
});
const webhookClient = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);

tclient.connect();

dclient.once('ready', () => {
	console.log('discord ready');
});

tclient.on('chat', async (channel, tags, message, self) => {
  if (self) return;
  if (!channel == `#${channel}`) return;
  const resp = await fetch(`https://api.twitch.tv/kraken/users/${tags['user-id']}`, { headers: { "Accept": "application/vnd.twitchtv.v5+json", "Client-ID": process.env.TWITCH_CLIENT_ID } })
  const res = await resp.json();
  const avurl = res.logo
  
  webhookClient.send(message, {
    username: `Twitch: ${tags['display-name']}`,
    avatarURL: avurl,
    allowedMentions: { parse: [] }
  })

}); 


dclient.on('message', async message => {
	if (message.author.id == dclient.user.id) return;
  if (message.webhookID) return;
  if (!message.guild.id === process.env.DISCORD_SERVER_ID && message.channel.id == process.env.DISCORD_CHANNEL_ID) return;
  tclient.say(process.env.TWITCH_CHANNEL_NAME, `Discord -> ${message.author.tag} | ${message.content}`);

  if (message.content == "ttv.ping") {
    message.channel.send(`Pong! ${dclient.ws.ping}ms`);
  }
});

keepAlive();
dclient.login(process.env.DISCORD_TOKEN);
