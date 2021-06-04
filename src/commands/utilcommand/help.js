const CommandClass = require('@util/CommandClass');
const {
	MessageEmbed,
} = require('discord.js');

module.exports = class HelpCommand extends CommandClass {
	constructor(botClient) {
		super(
			botClient,
			'help',
			'give help and info on the specified command',
			'<commandName/noCommandName>', {
				aliases: ['cmdinfo', 'command', 'cmd', 'commandinfo', 'cmds'],
				example: 'help ban or just help',
				cooldown: 5,
				guildonly: true,
			},
		);
	}
	async execute(message, args) {
		const embed = new MessageEmbed;
		const prefix = message.guild.guildConfig.get('defaultPrefix');
		const { commands } = this.botClient;

		if (!args.length) {
			embed.setTitle('Commands List');
			embed.addFields({
				name: 'Important to Know❗',
				value: `\nIf you want info on specific command send ${prefix}help [commandName] and don't send it here!`,
			});
			embed.setDescription(commands.map(cmd => cmd.name).join(', '));

			try {
				await message.author.send(embed);
				return message.reply('Sent all of my commands to your DM.');
			}
			catch (error) {
				console.error(error);
				return message.reply('Can\'t send my commands to your DM! Is your DM closed?.');
			}
		}

		const [cmdName] = args;
		cmdName.toLowerCase();
		const command = commands.get(cmdName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

		if (!command) {
			return message.reply('Make sure you type the correct command.');
		}

		embed.setColor('#EFFF00');
		embed.setTitle('Command Information');
		embed.addFields({
			name: 'Command Name:',
			value: `${command.name}`,
		}, {
			name: 'Command Desc:',
			value: `${command.desc}`,
		}, {
			name: 'Command Cooldown:',
			value: `${command.cooldown || 3} second(s)`,
		}, {
			name: 'Command Usage:',
			value: `${prefix}${cmdName} ${command.usage}`,
		});

		if (command.example) {
			embed.addFields({
				name: 'Command Example:',
				value: `${prefix}${command.example}`,
			});
		}
		if (command.aliases) {
			embed.addFields({
				name: 'Command Aliases:',
				value: `${command.aliases.join(', ')}`,
			});
		}
		if (command.args) {
			embed.addFields({
				name: 'Require arguments:',
				value: true,
			});
		}
		if (command.guildOwnerOnly) {
			embed.addFields({
				name: 'Owner Only:',
				value: true,
			});
		}
		if (command.permission) {
			embed.addFields({
				name: 'Require Permission:',
				value: true,
			});
		}
		message.channel.send(embed);
	}
};