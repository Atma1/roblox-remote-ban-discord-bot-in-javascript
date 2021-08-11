const DatabaseSlashCommand = require('@class/Command/DatabaseSlashCommand');
const PermissionData = require('@class/Permission Data/PermissionData');
const { roleExistsInCache, removeRoleFromCache } = require('@util/util');
const { getGuildConfigCollection } = require('@modules/GuildConfig');
const { updateSlashCommandPermission } = require('@modules/guildCommandPermission');

module.exports = class UnauthorizeCommand extends DatabaseSlashCommand {
	constructor(botClient) {
		super(
			botClient,
			'unauth',
			'Unauthorize specific role to command that require defaultPermission',
			'<@role>', {
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
		const { guild } = interaction;
		const { id:roleId } = Role;
		const { id: guildId, ownerId } = guild;
		const guildConfigCollection = getGuildConfigCollection(guildId, this.botClient);
		const guildSlashCommandIds = guildConfigCollection.get('guildSlashCommandIds');
		const cachedAuthorizedRoles = guildConfigCollection.get('authorizedRoles');

		if (!cachedAuthorizedRoles.length) {
			return interaction.reply({ content: 'This server doesn\'t  even  have authorized role!', allowedMentions: { repliedUser: true } });
		}

		if (!roleExistsInCache(cachedAuthorizedRoles, roleId)) {
			return interaction.reply({ content: 'That role is not even authorized!', allowedMentions: { repliedUser: true } });
		}

		const updatedCachedAuthorizedRoles = removeRoleFromCache(cachedAuthorizedRoles, roleId);
		const authorizedPermission = updatedCachedAuthorizedRoles.map(Id => new PermissionData(Id, 'ROLE', true));
		authorizedPermission.push(new PermissionData(ownerId, 'USER', true));

		try {
			await interaction.deferReply();
			await Promise.all([
				this.removeAuthorizedRole(roleId, guildId),
				updateSlashCommandPermission(guild, authorizedPermission, guildSlashCommandIds),
			]);
			guildConfigCollection.set('authorizedRoles', updatedCachedAuthorizedRoles);
			interaction.editReply({ content:`<@&${roleId}> has been removed from authorized role list!` });
		}
		catch (error) {
			console.error(error);
			return interaction.editReply({ content:`There was an error while removing the role!\n${error}`,
				ephemeral: true, allowedMentions: { repliedUser: true } })
				.catch(err => console.error(err));
		}
	}
};

