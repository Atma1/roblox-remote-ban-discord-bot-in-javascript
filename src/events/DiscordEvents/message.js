require('dotenv').config();
const Discord = require('discord.js');
const {
	checkPerm,
	convertUserRolesToArray,
} = require('@util/util');
const EventClass = require('@class/EventClass');

module.exports = class MessageEvent extends EventClass {
	constructor(botClient) {
		super(
			botClient,
			'message',
			'on',
		);
	}
	async execute(message) {

		if (message.channel.type === 'dm') return;

		const lowerCaseMessage = message.content.toLowerCase();
		const { guildConfig } = message.guild;
		const prefix = guildConfig.get('defaultPrefix');

		if (lowerCaseMessage.startsWith(prefix) && !message.author.bot) {
			const args = message.content.slice(prefix.length).trim().split(/ +/);
			const commandName = args.shift().toLowerCase();
			const command = this.botClient.commands.get(commandName) ||
				this.botClient.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

			if (!command) return;

			if (command.guildOwnerOnly && message.author.id != message.guild.ownerID) {
				return message.reply('only the guild owner can run that command!');
			}

			if (command.permission && !message.member.hasPermission('ADMINISTRATOR')) {
				const cachedAuthorizedRoles = guildConfig.get('authorizedRoles');

				if (!cachedAuthorizedRoles.length) {
					return message.reply('cannot find this server authorized role!');
				}

				const userRoles = message.member.roles.cache;
				const isUserAuthorized = checkPerm(convertUserRolesToArray(userRoles), cachedAuthorizedRoles);

				if (!isUserAuthorized) {
					return message.reply('you don\'t have permission to do that!');
				}
			}

			if (command.args && !args.length || args.length < command.reqarglength) {
				let reply = 'please provide the necessary amount of argument(s)!';
				reply += `\n Do this: \`${prefix}${commandName} ${command.usage}\``;
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

				if (expirationTime > now) {
					const timeLeft = (expirationTime - now) / 1000;
					return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing!`);
				}
			}

			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

			try {
				console.log(args, lowerCaseMessage);
				command.execute(message, args);
			}
			catch (error) {
				console.error(error);
				message.reply(`there was an error while executing the command!\n${error}`);
			}
		}
	}
};