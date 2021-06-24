const {
	Structures,
	Collection,
} = require('discord.js');
const {
	guildConfigDocConverter,
	createNewGuildDataBase,
} = require('@util/util');
const admin = require('firebase-admin');
const firestore = admin.firestore();


Structures.extend('Guild', Guild => {
	class GuildConfig extends Guild {
		constructor(client, data) {
			super(client, data);
			this.guildConfig = new Collection();
			this.setupGuildConfig();
		}

		async setupGuildConfig() {
			try {
				const snapshot = await this.getGuildPrefixAndRole();

				if (!snapshot.exists) {
					const [response, guildOwner] = await Promise.all([
						createNewGuildDataBase(this.id, firestore),
						this.client.users.fetch(this.ownerID),
					]);
					this.guildConfig.set('defaultPrefix', '!');
					this.guildConfig.set('authorizedRoles', []);
					await guildOwner.send({ content:response });
				}
				else {
					const {
						defaultPrefix,
						authorizedRoles,
					} = snapshot.data();

					this.guildConfig.set('defaultPrefix', defaultPrefix || '!');
					this.guildConfig.set('authorizedRoles', authorizedRoles || []);
				}
			}
			catch (error) {
				console.error(error);
			}
		}

		getGuildPrefixAndRole() {
			return firestore
				.collection(`guildDataBase:${this.id}`)
				.doc('guildConfigurations')
				.withConverter(guildConfigDocConverter)
				.get();
		}
	}
	return GuildConfig;
});