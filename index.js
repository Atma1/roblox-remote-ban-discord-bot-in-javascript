const Discord = require('discord.js');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
const DiscordClient = require('./util/DiscordClient');
require('dotenv').config();
const token = process.env.token;

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const client = new DiscordClient;
client.cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();

client.startBot(token);
