const admin = require('firebase-admin');
const { getUserId } = require('@modules/getUserId');
const { getUserImg } = require('@modules/getUserImg');
const { playerBanDocConverter } = require('@util/util');
const { firestore } = admin;
const dateformat = require('dateformat');
const genericCommandClass = require('./CommandClass');

module.exports = class DataBaseRelatedCommandClass extends genericCommandClass {

	constructor(botClient, name, desc, usage, commandOptions = {}) {
		super(botClient, name, desc, usage, commandOptions);
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

	retriveBanDocument(playerName, guildId) {
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

	setDefaultPrefix(desiredDefaultPrefix, guildId) {
		this.database.collection(`guildDataBase:${guildId}`)
			.doc('guildConfigurations')
			.update({
				'guildConfig.defaultPrefix': desiredDefaultPrefix,
			});
	}

	getUserId(playerName) {
		return getUserId(playerName);
	}

	getUserImg(playerId) {
		return getUserImg(playerId);
	}

	dateformat(date) {
		return dateformat(date, 'UTC:ddd, mmm dS, yyyy, HH:MM:ss TT Z');
	}
};