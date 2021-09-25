const SlashCommand = require('@class/Command/SlashCommand');
const CommandInfoEmbed = require('@class/Embed/CommandInfoEmbed');
const CommandListEmbed = require('@class/Embed/CommandListEmbed');

module.exports = class HelpCommand extends SlashCommand {
	constructor(botClient) {
		super(
			botClient,
			{
				commandName: 'help',
				description: 'Give help or info on the specified command',
				usage: '<commandName(Optional)>',
				example: '/help ban',
				defaultPermission: false,
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
		const { slashCommands } = this.botClient;
		const commandName = interactionOptions.getString('command');

		if (!commandName) {
			const commandListEmbed = new CommandListEmbed(slashCommands);
			try {
				await interaction.deferReply();
				await interaction.user.send({ embeds:[commandListEmbed] });
				return interaction.editReply({ content: 'Sent all of my commands to your DM.', allowedMentions: { repliedUser: true } });
			}
			catch (error) {
				console.error(error);
				return interaction.editReply({ content: 'Can\'t send my commands to your DM! Is your DM closed?', allowedMentions: { repliedUser: true } });
			}
		}

		commandName.toLowerCase();
		const command = slashCommands.get(commandName) || slashCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return interaction.reply({ content: 'Make sure you type the correct command.', allowedMentions: { repliedUser: true } });
		}

		const commandInfoEmbed = new CommandInfoEmbed(command, commandName);
		interaction.reply({ embeds:[commandInfoEmbed] })
			.catch(err => console.error(err));
	}
};