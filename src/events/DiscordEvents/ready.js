const EventClass = require('@class/EventClass');
const runAutoUnban = require('@modules/runAutoUnban');
const { setupGuildConfigAndCommand } = require('@modules/guildConfig');
const ms = require('ms');

module.exports = class ReadyEvent extends EventClass {
	constructor(botClient) {
		super(
			botClient,
			'ready',
			'once',
		);
	}
	async execute() {
		console.log(`${this.botClient.user.tag} is ready!`);
		const { cache:clientGuilds } = this.botClient.guilds;

		clientGuilds.forEach(async guild =>
			await setupGuildConfigAndCommand(guild, this.botClient));

		runAutoUnban(clientGuilds);
		setTimeout(() => runAutoUnban(clientGuilds), ms('10m'));
	}
};