const { Collection, Permissions } = require('discord.js');
const ms = require('ms');
const { checkPerm, convertUserRolesToArray } = require('@util/util');
const EventClass = require('@class/EventClass');
const { getGuildConfigCollection } = require('@modules/GuildConfig');

module.exports = class MessageEvent extends EventClass {
	constructor(botClient) {
		super(
			botClient,
			'messageCreate',
			'on',
		);
	}
	async execute(message) {

		if (message.channel.type === 'dm') return;

		const { content:messageContent, guild:messageGuild } = message;
		const { id:guildId } = messageGuild;
		const { commands } = this.botClient;
		const guildConfigCollection = getGuildConfigCollection(guildId, this.botClient);
		const prefix = guildConfigCollection.get('prefix');

		if (messageContent.startsWith(prefix) && !message.author.bot) {
			const [commandName, ...args] = messageContent.slice(prefix.length).trim().split(/ +/);
			const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

			if (!command) return;

			if (command.guildOwnerOnly && message.author.id != message.guild.ownerId) {
				return message.reply({ content:'only the guild owner can run that command!', allowedMentions: { repliedUser: true } });
			}

			if (command.permission && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
				const cachedAuthorizedRoles = guildConfigCollection.get('authorizedRoles');

				if (!cachedAuthorizedRoles.length) {
					return message.reply({ content:'cannot find this server authorized role!', allowedMentions: { repliedUser: true } });
				}

				const { cache:userRoles } = message.member.roles;
				const userAuthorized = checkPerm(convertUserRolesToArray(userRoles), cachedAuthorizedRoles);

				if (!userAuthorized) {
					return message.reply({ content:'you don\'t have permission to do that!', allowedMentions: { repliedUser: true } });
				}
			}

			if (command.args && !args.length || args.length < command.reqarglength) {
				let reply = 'please provide the necessary amount of argument(s)!';
				reply += `\n Do this: \`${prefix}${commandName} ${command.usage}\``;
				return message.reply({ content:reply, allowedMentions: { repliedUser: true } });
			}

			const { cooldowns } = this.botClient;

			if (!cooldowns.has(command.name)) {
				cooldowns.set(command.name, new Collection());
			}

			const now = Date.now();
			const cooldownAmount = command.cooldown ? ms(command.cooldown) : ms('3s');
			const timestamps = cooldowns.get(command.name);

			if (timestamps.has(message.author.id)) {
				const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

				if (expirationTime > now) {
					const timeLeft = ms(expirationTime - now, { long: true });
					return message.reply({ content:`please wait ${timeLeft} before reusing!`, allowedMentions: { repliedUser: true } });
				}
			}

			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

			try {
				console.log(args, messageContent);
				command.execute(message, args);
			}
			catch (error) {
				console.error(error);
				message.reply({ content:`there was an error while executing the command!\n${error}`, allowedMentions: { repliedUser: true } });
			}
		}
	}
};