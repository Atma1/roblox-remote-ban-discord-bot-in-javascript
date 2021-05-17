const admin = require('firebase-admin');
const { getUserId } = require('../modules/getUserId');
const { getUserImg } = require('../modules/getUserImg') ;
const dateformat = require('dateformat');
const genericCommandClass = require('./CommandClass');
const { firestore } = admin;

module.exports = class DataBaseRelatedCommandClass extends genericCommandClass {

	constructor(botClient, name, desc, usage, commandOptions = {}) {
		super(botClient, name, desc, usage, commandOptions);
		this.firestore = firestore;
		this.dataBase = admin.firestore();
	}

	getUserId(playerName) {
		const playerId = getUserId(playerName);
		return playerId;
	}

	getUserImg(playerId) {
		const playerImg = getUserImg(playerId);
		return playerImg;
	}

	dateformat(date) {
		const formattedDate = dateformat(date, 'UTC:ddd, mmm dS, yyyy, HH:MM:ss TT Z');
		return formattedDate;
	}
};