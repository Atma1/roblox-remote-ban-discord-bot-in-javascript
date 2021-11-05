const admin = require('firebase-admin');
const { playerBanDocConverter } = require('@util/util');
const { firestore } = admin;
const SlashCommandClass = require('./SlashCommand');

module.exports = class DatabaseSlashCommand extends SlashCommandClass {

	constructor(botClient, commandOptions) {
		super(botClient, commandOptions);
		this.firestore = firestore;
		this.database = admin.firestore();
	}

	addPlayerToBanList(playerBanDoc, guildId) {
		this.database.collection(`guildDataBase:${guildId}`)
			.doc('banList')
			.collection('bannedPlayerList')
			.doc(`Player:${playerBanDoc.banDetails.playerID}`)
			.withConverter(playerBanDocConverter)
			.set(playerBanDoc, {
				merge: true,
			});
	}

	retrieveBanDocument(playerName, guildId) {
		const lowercasePlayerName = playerName.toLowerCase();
		return this.database.collection(`guildDataBase:${guildId}`)
			.doc('banList')
			.collection('bannedPlayerList')
			.where('banDetails.playerName', '==', lowercasePlayerName)
			.withConverter(playerBanDocConverter)
			.get();
	}

	deletePlayerBanDocument(playerId, guildId) {
		this.database.collection(`guildDataBase:${guildId}`)
			.doc('banList')
			.collection('bannedPlayerList')
			.doc(`Player:${playerId}`)
			.delete();
	}

	removeAuthorizedRole(roleId, guildId) {
		this.database.collection(`guildDataBase:${guildId}`)
			.doc('guildConfigurations')
			.update({
				'guildConfig.authorizedRoles': this.firestore.FieldValue.arrayRemove(`${roleId}`),
			});
	}

	addAuthorizedRole(roleId, guildId) {
		this.database.collection(`guildDataBase:${guildId}`)
			.doc('guildConfigurations')
			.update({
				'guildConfig.authorizedRoles': this.firestore.FieldValue.arrayUnion(`${roleId}`),
			});
	}

};