const EventClass = require('@class/Event/EventClass');
const runAutoUnban = require('@modules/runAutoUnban');
const { setupGuildConfigAndCommandForGuilds } = require('@modules/guildConfig');
const ms = require('ms');

module.exports = class ReadyEvent extends EventClass {
	constructor(botClient) {
		super(
			botClient,
			{
				eventType: 'ready',
				eventEmitter: 'once',
			},
		);
	}
	async execute() {
		const { cache:clientGuildsMap } = this.botClient.guilds;
		await setupGuildConfigAndCommandForGuilds(clientGuildsMap, this.botClient);
		await runAutoUnban(clientGuildsMap);
		console.log(`${this.botClient.user.tag} is ready!`);
		setTimeout(() => runAutoUnban(clientGuildsMap), ms('10m'));
	}
};