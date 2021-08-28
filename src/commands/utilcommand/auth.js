const DatabaseSlashCommand = require('@class/Command/DatabaseSlashCommand');
const PermissionData = require('@class/Permission Data/PermissionData');
const { roleExistsInCache } = require('@util/util');
const { getGuildConfigCollection } = require('@modules/GuildConfig');
const { updateSlashCommandPermission } = require('@modules/guildCommandPermission');

module.exports = class AuthorizeCommand extends DatabaseSlashCommand {
	constructor(botClient) {
		super(
			botClient,
			'auth',
			'Authorize specific role to command that require defaultPermission',
			'<@role>', {
				example: 'auth @joemama',
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
		const { guild } = interaction;
		const { id:guildId, ownerId } = guild;
		const guildConfigCollection = getGuildConfigCollection(guildId, this.botClient);
		const cachedAuthorizedRoles = guildConfigCollection.get('authorizedRoles');
		const guildSlashCommandIds = guildConfigCollection.get('guildSlashCommandIds');

		if (roleExistsInCache(cachedAuthorizedRoles, roleId)) {
			return interaction.reply({ content: 'That role is already authorized!', allowedMentions: { repliedUser: true } });
		}

		cachedAuthorizedRoles.push(roleId);
		const authorizedPermission = cachedAuthorizedRoles.map(cachedRoleId => new PermissionData(cachedRoleId, 'ROLE', true));
		authorizedPermission.push(new PermissionData(ownerId, 'USER', true));

		try {
			await interaction.deferReply();
			await Promise.all([
				this.addAuthorizedRole(roleId, guildId),
				updateSlashCommandPermission(guild, authorizedPermission, guildSlashCommandIds),
			]);
			guildConfigCollection.set('authorizedRoles', cachedAuthorizedRoles);
			return interaction.editReply({ content:`<@&${roleId}> has been authorized to use defaultPermission restricted command!` });
		}
		catch (error) {
			console.error(error);
			return interaction.editReply({ content:`There was an error while adding the role!\n${error}`,
				ephemeral: true, allowedMentions: { repliedUser: true } });
		}
	}
};