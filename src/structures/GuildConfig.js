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

				if (!snap.exists) {
					console.warn(`Guild config for guild ${this.id} is not avaible!`);
				}

				const { defaultPrefix, authorizedRoles } = snap.data();
				console.log(defaultPrefix, authorizedRoles);
				this.guildConfig.set('defaultPrefix', defaultPrefix || '!');
				this.guildConfig.set('authorizedRoles', authorizedRoles || []);
			}
			catch (error) {
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