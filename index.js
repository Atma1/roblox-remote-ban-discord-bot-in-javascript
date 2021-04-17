const Discord = require('discord.js');
const serviceAccount = require('./serviceAccount.json');
const DiscordClient = require('./util/DiscordClient');
require('dotenv').config();
const token = process.env.token;

const client = new DiscordClient(token, serviceAccount);
client.cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();

client.initFireBaseFireStoreApp();
client.startBot();