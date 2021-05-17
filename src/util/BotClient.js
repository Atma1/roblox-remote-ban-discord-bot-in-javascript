const {
	Client,
} = require('discord.js');
const util = require('./util');
const admin = require('firebase-admin');

module.exports = class BotClient extends Client {

	constructor(token, serviceAccount) {
		super();
		this.token = token;
		this.serviceAccount = serviceAccount;
		this.cachedAuthorizedRoles = undefined;
	}

	initFireBaseFireStoreApp() {
		admin.initializeApp({
			credential: admin.credential.cert(this.serviceAccount),
		});
	}

	async startBot() {
		this.initFireBaseFireStoreApp();
		this.cachedAuthorizedRoles = util.getAuthRoles(admin.firestore());
		util.loadCommands(this);
		util.loadEvents(this);
		super.login(this.token);
	}
};