const CommandClass = require('@class/CommandClass');
const CommandInfoEmbed = require('@class/CommandInfoEmbed');
const CommandListEmbed = require('@class/CommandListEmbed');

module.exports = class HelpCommand extends CommandClass {
	constructor(botClient) {
		super(
			botClient,
			'help',
			'give help and info on the specified command',
			'<commandName/noCommandName>', {
				aliases: ['cmdinfo', 'command', 'cmd', 'commandinfo', 'cmds'],
				example: 'help ban or just help',
				cooldown: '5s',
			},
		);
	}
	async execute(message, args) {
		const prefix = message.guild.guildConfig.get('defaultPrefix');
		const {
			commands,
		} = this.botClient;

		if (!args.length) {
			const commandListEmbed = new CommandListEmbed(commands, prefix);
			try {
				await message.author.send(commandListEmbed);
				return message.reply('sent all of my commands to your DM.');
			}
			catch (error) {
				console.error(error);
				return message.reply('can\'t send my commands to your DM! Is your DM closed?');
			}
		}

		const [commandName] = args;
		commandName.toLowerCase();
		const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.reply('make sure you type the correct command.');
		}
		const commandInfoEmbed = new CommandInfoEmbed(commands, commandName, prefix);

		message.channel.send(commandInfoEmbed);
	}
};