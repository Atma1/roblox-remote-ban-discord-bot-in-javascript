const admin = require('firebase-admin');
const { getUserId } = require('../modules/getUserId');
const { getUserImg } = require('../modules/getUserImg') ;
const dateformat = require('dateformat');
const { firestore } = admin;

module.exports = class DataBaseRelatedCommandClass {

	constructor(name, desc, usage, commandOptions = {}) {
		this.name = name;
		this.desc = desc;
		this.usage = usage;
		this.aliases = commandOptions.aliases || false;
		this.example = commandOptions.example || 'No example';
		this.cooldown = commandOptions.cooldown || 3;
		this.args = commandOptions.args || false;
		this.guildonly = commandOptions.guildonly || false;
		this.permission = commandOptions.permission || false;
		this.reqarglength = commandOptions.reqarglength || false;
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