const DataBaseRelatedCommandClass = require('@class/DataBaseRelatedCommandClass');

module.exports = class SetPrefixCommand extends DataBaseRelatedCommandClass {
	constructor(botClient) {
		super(
			botClient,
			'setdefaultprefix',
			'Set the default prefix. Use this command wisely.',
			'<desiredDefaultPrefix>',
			{
				aliases: ['sdf', 'defaultprefix', 'df'],
				example: 'setdefaultprefix ε',
				cooldown: '5s',
				args: true,
				reqarglength: 1,
				guildOwnerOnly: true,
			});
	}
	async execute(message, args) {
		const { guildConfig, id: guildId } = message.guild;
		const [newDefaultPrefix] = args;

		try {
			await this.setDefaultPrefix(newDefaultPrefix, guildId);
		}
		catch (error) {
			console.error(error);
			return message.reply({ content:`there was an error while updating the prefix!\n${error}`, allowedMentions: { repliedUser: true } });
		}

		guildConfig.set('defaultPrefix', newDefaultPrefix);
		return message.channel.send({ content:`The defaultPrefix has been set to \`${newDefaultPrefix}\`` });
	}
};