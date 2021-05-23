const admin = require('firebase-admin');
const { getUserId } = require('../modules/getUserId');
const { getUserImg } = require('../modules/getUserImg');
const dateformat = require('dateformat');
const genericCommandClass = require('./CommandClass');
const { playerBanDocConverter } = require('../util/util');
const { firestore } = admin;

module.exports = class DataBaseRelatedCommandClass extends genericCommandClass {

	constructor(botClient, name, desc, usage, commandOptions = {}) {
		super(botClient, name, desc, usage, commandOptions);
		this.firestore = firestore;
		this.dataBase = admin.firestore();
	}

	addPlayerToBanList(playerBanDoc) {
		this.dataBase.collection('serverDataBase')
			.doc('banList')
			.collection('bannedPlayerList')
			.doc(`Player:${playerBanDoc.playerID}`)
			.withConverter(playerBanDocConverter)
			.set(playerBanDoc, {
				merge: true,
			});
	}

	retriveBanDocument(playerId) {
		return this.dataBase.collection('serverDataBase')
			.doc('banList')
			.collection('bannedPlayerList')
			.doc(`Player:${playerId}`)
			.withConverter(playerBanDocConverter)
			.get();
	}

	deletePlayerBanDocument(playerId) {
		this.dataBase.collection('serverDataBase')
			.doc('banList')
			.collection('bannedPlayerList')
			.doc(`Player:${playerId}`)
			.delete();
	}

	getUserId(playerName) {
		return getUserId(playerName);
	}

	getUserImg(playerId) {
		return getUserImg(playerId);
	}

	dateformat(date) {
		const formattedDate = dateformat(date, 'UTC:ddd, mmm dS, yyyy, HH:MM:ss TT Z');
		return formattedDate;
	}
};