require('dotenv').config();
const Discord = require('discord.js');
const {
	checkPerm,
	convertUserRolesToArray,
} = require('../../util/util');
const prefix = process.env.prefix;
const EventClass = require('../../util/EventClass');

module.exports = class extends EventClass {
	constructor(botClient) {
		super(
			botClient,
			'message',
			'on',
		);
	}
	async execute(message) {
		const lowerCaseMessage = message.content.toLowerCase();

		if (lowerCaseMessage.startsWith(prefix) && !message.author.bot) {
			const args = message.content.slice(prefix.length).trim().split(/ +/);
			const commandName = args.shift().toLowerCase();
			const command = this.botClient.commands.get(commandName) ||
				this.botClient.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

			if (!command) return;

			if (command.guildonly && message.channel.type === 'dm') {
				return message.reply('Can\'t do that in dm!');
			}

			if (command.permission && !message.member.hasPermission('ADMINISTRATOR')) {
				const userRoles = message.member.roles.cache;
				const { cachedAuthorizedRoles } = this.botClient;
				const isUserAuthorized = checkPerm(message, convertUserRolesToArray(userRoles), cachedAuthorizedRoles);
				if (!isUserAuthorized) {
					return message.channel.send('You don\'t have permission to do that!');
				}
			}

			if (command.args && !args.length || args.length < command.reqarglength) {
				let reply = 'Please provide the necessary amount of argument(s).';
				reply += `\n Do this: \`${prefix}${command.usage}\``;
				return message.reply(reply);
			}

			const {
				cooldowns,
			} = this.botClient;

			if (!cooldowns.has(command.name)) {
				cooldowns.set(command.name, new Discord.Collection());
			}

			const now = Date.now();
			const cooldownAmount = (command.cooldown || 3) * 1000;
			const timestamps = cooldowns.get(command.name);

			if (timestamps.has(message.author.id)) {
				const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing!`);
				}
			}

			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

			try {
				console.log(lowerCaseMessage);
				console.log(args);
				command.execute(message, args);
			}
			catch (error) {
				console.error(error);
				message.reply(`There was an error while executing the command!\n${error}`);
			}
		}
	}
};