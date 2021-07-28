const DataBaseRelatedSlashCommandClass = require('@class/DataBaseRelatedSlashCommandClass');
const CommandInfoEmbed = require('@class/CommandInfoEmbed');
const CommandListEmbed = require('@class/CommandListEmbed');

module.exports = class HelpCommand extends DataBaseRelatedSlashCommandClass {
	constructor(botClient) {
		super(
			botClient,
			'help',
			'give help and info on the specified command',
			'<commandName(Optional)>', {
				aliases: ['cmdinfo', 'command', 'cmd', 'commandinfo', 'cmds', 'commands'],
				example: 'help ban',
				cooldown: '5s',
				slashCommandOptions: [{
					name: 'command',
					description: 'The name of the command to look up.',
					type: 'STRING',
					required: false,
				}],
			},
		);
	}
	async execute(interaction, interactionOptions) {
		const { slashCommandsData } = this.botClient;
		const commandName = interactionOptions.getString('command');

		if (!commandName) {
			const commandListEmbed = new CommandListEmbed(slashCommandsData);
			try {
				await interaction.defer();
				await interaction.user.send({ embeds:[commandListEmbed] });
				return interaction.editReply({ content: 'Sent all of my commands to your DM.', allowedMentions: { repliedUser: true } });
			}
			catch (error) {
				console.error(error);
				return interaction.editReply({ content: 'Can\'t send my commands to your DM! Is your DM closed?', allowedMentions: { repliedUser: true } });
			}
		}

		commandName.toLowerCase();
		const command = slashCommandsData.get(commandName) || slashCommandsData.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return interaction.reply({ content: 'Make sure you type the correct command.', allowedMentions: { repliedUser: true } });
		}

		const commandInfoEmbed = new CommandInfoEmbed(command, commandName);
		interaction.reply({ embeds:[commandInfoEmbed] });
	}
};