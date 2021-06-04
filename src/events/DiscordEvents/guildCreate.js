const admin = require('firebase-admin');
const DB = admin.firestore();
const EventClass = require('@util/EventClass');
const GuildConfigDocument = require('@util/GuildConfigDocumentClass');
const { GuildConfigDocConverter } = require('@util/util');

module.exports = class GuildCreateEvent extends EventClass {
	constructor(botClient) {
		super(
			botClient,
			'guildCreate',
			'on',
		);
	}
	async execute(guildData) {

		const { id, ownerID } = guildData;
		const guildOwner = await this.botClient.users.fetch(ownerID);

		try {
			await DB.collection(`guildDataBase:${id}`)
				.doc('guildConfigurations')
				.withConverter(GuildConfigDocConverter)
				.create(new GuildConfigDocument());

			let dm = 'Collection containing your guild config has been created.';
			dm += ' Be sure to add roles is authorized to use the commands!';

			guildOwner.send(dm);
			console.log(`Database for guild ${id} has been created.`);
		}
		catch (error) {
			guildOwner.send('There was an error while creating your guild collection!');
			console.error(error);
		}
	}
};