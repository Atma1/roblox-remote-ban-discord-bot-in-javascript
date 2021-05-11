const admin = require('firebase-admin');
const { getUserId } = require('../modules/getUserId');
const { getUserImg } = require('../modules/getUserImg') ;
const dateformat = require('dateformat');
const genericCommandClass = require('./CommandClass');
const { firestore } = admin;

module.exports = class DataBaseRelatedCommandClass extends genericCommandClass {

	constructor(name, desc, usage, commandOptions = {}) {
		super(name, desc, usage, commandOptions);
		this.FieldValue = firestore.FieldValue;
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
		const formattedDate = dateformat(date, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
		return formattedDate;
	}
};