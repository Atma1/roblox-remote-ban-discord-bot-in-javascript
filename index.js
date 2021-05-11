const Discord = require('discord.js');
const serviceAccount = require('./serviceAccount.json');
const BotClient = require('./util/BotClient');
require('dotenv').config();
const token = process.env.token;

const client = new BotClient(token, serviceAccount);
client.cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();

client.startBot();