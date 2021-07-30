const DatabaseSlashCommand = require('@class/Command/DatabaseSlashCommand');
const { roleExistsInCache } = require('@util/util');
const { getGuildConfigCollection } = require('@modules/GuildConfig');

module.exports = class AuthorizeCommand extends DatabaseSlashCommand {
	constructor(botClient) {
		super(
			botClient,
			'auth',
			'authorize specific role to command that require defaultPermission',
			'<@role>', {
				aliases: ['permit', 'authforrole', 'at'],
				example: 'auth @joemama',
				cooldown: '5s',
				defaultPermission: false,
				slashCommandOptions: [{
					name: 'role',
					description: 'The role to authorize.',
					type: 'ROLE',
					required: true,
				}],
			});
	}
	async execute(interaction, interactionOptions) {
		const Role = interactionOptions.getRole('role');
		const { id:roleId } = Role;
		const { id: guildId, roles: guildRoles } = interaction.guild;
		const guildConfigCollection = getGuildConfigCollection(guildId, this.botClient);
		const cachedAuthorizedRoles = guildConfigCollection.get('authorizedRoles');

		if (roleExistsInCache(guildRoles.cache, roleId)) {
			return interaction.reply({ content: 'That role is already authorized!', allowedMentions: { repliedUser: true } });
		}

		try {
			await interaction.defer();
			await this.addAuthorizedRole(roleId, guildId);
		}
		catch (error) {
			console.error(error);
			return interaction.editReply({ content:`There was an error while adding the role!\n${error}`,
				ephemeral: true, allowedMentions: { repliedUser: true } });
		}

		cachedAuthorizedRoles.push(roleId);
		guildConfigCollection.set('authorizedRoles', cachedAuthorizedRoles);

		return interaction.editReply({ content:`<@&${roleId}> has been authorized to use defaultPermission restricted command!` });
	}
};