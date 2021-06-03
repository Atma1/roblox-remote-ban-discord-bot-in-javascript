const { Structures, Collection } = require('discord.js');
const { GuildConfigDocConverter } = require('@util/util');
const admin = require('firebase-admin');

Structures.extend('Guild', (Guild) => {
	class GuildConfig extends Guild {
		constructor(client, data) {
			super(client, data);
			this.guildDataBase = admin.firestore();
			this.guildConfig = new Collection();
			this.setupGuildConfig();
		}

		async setupGuildConfig() {
			try {
				const snap = await this.getGuildPrefixAndRole();
				const { defaultPrefix, authorizedRoles } = snap.data();
				this.guildConfig.set('defaultPrefix', defaultPrefix);
				this.guildConfig.set('authorizedRoles', authorizedRoles);
			}
			catch (error) {
				this.owner.send('There was an error while setting up your guildConfig.', error);
				console.error(error);
			}
		}

		getGuildPrefixAndRole() {
			return this.guildDataBase
				.collection(`guildDataBase:${this.id}`)
				.doc('guildConfigurations')
				.withConverter(GuildConfigDocConverter)
				.get();
		}
	}
	return GuildConfig;
});