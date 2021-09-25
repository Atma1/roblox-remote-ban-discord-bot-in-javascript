const DatabaseSlashCommand = require('@class/Command/DatabaseSlashCommand');
const PermissionData = require('@class/Permission Data/PermissionData');
const { roleExistsInCache, removeRoleFromCache } = require('@util/util');
const { getGuildConfigCollection } = require('@modules/GuildConfig');
const { updateSlashCommandPermission } = require('@modules/guildCommandPermission');

module.exports = class UnauthorizeCommand extends DatabaseSlashCommand {
	constructor(botClient) {
		super(
			botClient,
			{
				commandName: 'unauth',
				description: 'Unauthorize specific role to command that require defaultPermission',
				usage: '<@role>',
				example: 'auth @joemama',
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
		const authorizedPermission = updatedCachedAuthorizedRoles.map(cachedRoleId => new PermissionData(cachedRoleId, 'ROLE', true));
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
			return interaction.editReply({ content: error })
				.catch(err => console.error(err));
		}
	}
};

