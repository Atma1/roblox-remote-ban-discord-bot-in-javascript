const {
	Structures,
	Collection,
} = require('discord.js');
const {
	guildConfigDocConverter,
} = require('@util/util');
const admin = require('firebase-admin');
const firestore = admin.firestore();


Structures.extend('Guild', (Guild) => {
	class GuildConfig extends Guild {
		constructor(client, data) {
			super(client, data);
			this.guildConfig = new Collection();
			this.setupGuildConfig();
		}

		async setupGuildConfig() {
			const snap = await this.getGuildPrefixAndRole()
				.catch(err => console.error(err));

			if (!snap.exists) {
				console.warn(`Guild config for guild ${this.id} is not avaible!`);
			}
			else {
				const {
					defaultPrefix,
					authorizedRoles,
				} = snap.data();

				this.guildConfig.set('defaultPrefix', defaultPrefix || '!');
				this.guildConfig.set('authorizedRoles', authorizedRoles || []);
			}
		}

		getGuildPrefixAndRole() {
			try {
				return firestore
					.collection(`guildDataBase:${this.id}`)
					.doc('guildConfigurations')
					.withConverter(guildConfigDocConverter)
					.get();
			}
			catch (error) {
				throw(`${error}`);
			}
		}
	}
	return GuildConfig;
});