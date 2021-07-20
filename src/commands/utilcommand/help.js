const CommandClass = require('@class/CommandClass');
const CommandInfoEmbed = require('@class/CommandInfoEmbed');
const CommandListEmbed = require('@class/CommandListEmbed');
const { getGuildConfigCollection } = require('@modules/GuildConfig');

module.exports = class HelpCommand extends CommandClass {
	constructor(botClient) {
		super(
			botClient,
			'help',
			'give help and info on the specified command',
			'<commandName(Optional)>', {
				aliases: ['cmdinfo', 'command', 'cmd', 'commandinfo', 'cmds', 'commands'],
				example: 'help ban',
				cooldown: '5s',
			},
		);
	}
	async execute(message, args) {
		const { id: guildId } = message.guild;
		const guildConfigCollection = getGuildConfigCollection(guildId, this.botClient);
		const prefix = guildConfigCollection.get('prefix');
		const { commands } = this.botClient;

		if (!args.length) {
			const commandListEmbed = new CommandListEmbed(commands, prefix);
			try {
				await message.author.send({ embeds:[commandListEmbed] });
				return message.reply({ content: 'Sent all of my commands to your DM.', allowedMentions: { repliedUser: true } });
			}
			catch (error) {
				console.error(error);
				return message.reply({ content: 'Can\'t send my commands to your DM! Is your DM closed?', allowedMentions: { repliedUser: true } });
			}
		}

		const [commandName] = args;
		commandName.toLowerCase();
		const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.reply({ content: 'Make sure you type the correct command.', allowedMentions: { repliedUser: true } });
		}
		const commandInfoEmbed = new CommandInfoEmbed(command, commandName, prefix);

		message.channel.send({ embeds:[commandInfoEmbed] });
	}
};