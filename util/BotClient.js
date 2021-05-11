const { Client } = require('discord.js');
const util = require('./util') ;
const admin = require('firebase-admin') ;

module.exports = class DiscordClient extends Client {

	constructor(token, serviceAccount) {
		super();
		this.token = token;
		this.serviceAccount = serviceAccount;
	}

	initFireBaseFireStoreApp() {
		admin.initializeApp({
			credential: admin.credential.cert(this.serviceAccount),
		});
	}

	async startBot() {
		this.initFireBaseFireStoreApp();
		util.loadCommands(this);
		util.loadEvents(this);
		super.login(this.token);
	}
};