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
				cooldown: 5,
				args: true,
				reqarglength: 1,
				guildOwnerOnly: true,
			});
	}
	async execute(message, args) {
		const { guildConfig, id: guildId } = message.guild;
		const [desiredDefaultPrefix] = args;

		try {
			await this.setDefaultPrefix(desiredDefaultPrefix, guildId);
		}
		catch (error) {
			console.error(error);
			return message.reply(`there was an error while updating the prefix!\n${error}`);
		}

		guildConfig.set('defaultPrefix', desiredDefaultPrefix);
		return message.channel.send(`The defaultPrefix has been set to ${desiredDefaultPrefix}.`);
	}
};