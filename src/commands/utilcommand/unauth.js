const DatabaseSlashCommand = require('@class/Command/DatabaseSlashCommand');
const { roleExistsInCache, removeRoleFromCache } = require('@util/util');
const { getGuildConfigCollection } = require('@modules/GuildConfig');

module.exports = class AuthorizeCommand extends DatabaseSlashCommand {
	constructor(botClient) {
		super(
			botClient,
			'unauth',
			'authorize specific role to command that require defaultPermission',
			'<@role>', {
				aliases: ['permit', 'authforrole', 'at'],
				example: 'auth @joemama',
				cooldown: '5s',
				defaultPermission: false,
				slashCommandOptions: [{
					name: 'role',
					description: 'The role to unauthorize.',
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

		if (!roleExistsInCache(guildRoles.cache, roleId)) {
			return interaction.reply({ content: 'That role is not even authorized!', allowedMentions: { repliedUser: true } });
		}

		try {
			await interaction.defer();
			await this.addAuthorizedRole(roleId, guildId);
		}
		catch (error) {
			console.error;
			return interaction.editReply({ content:`There was an error while removing the role!\n${error}`,
				ephemeral: true, allowedMentions: { repliedUser: true } });
		}

		const updatedCachedRoles = removeRoleFromCache(roleId, cachedAuthorizedRoles);
		guildConfigCollection.set('authorizedRoles', updatedCachedRoles);
		return interaction.editReply({ content:`<@&${roleId}> has been has been removed from authorized role list!` });
	}
};

