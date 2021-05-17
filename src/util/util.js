const fs = require('fs');

const PlayerBanDocumentCreator = class PlayerBanDocument {
	constructor(playerID, playerName, banReason, bannedBy, bannedAt) {
		this.playerID = playerID;
		this.playerName = playerName;
		this.banReason = banReason;
		this.bannedBy = bannedBy;
		this.bannedAt = bannedAt;
		return this;
	}
};

const convertUserRolesToArray = (userRoles) => {
	const userRoleIds = [];
	userRoles.forEach(role => {
		userRoleIds.push(role.id);
	});
	return userRoleIds;
};

const checkPermission = (message, userRoles, authorizedRoles) => {
	if (!authorizedRoles.length) {
		return message.channel.send('No authorized roles found.\nThe owner needs to add roles that is authorized to use the commands.');
	}
	return userRoles.some(userRole => authorizedRoles.includes(userRole));
};

const retriveAuthroles = async (DB) => {
	try {
		const snapshot = await DB.collection('serverDataBase').doc('serverData').get();
		if (!snapshot.exists) {
			throw new Error('No authorized roles found. Possiblity of an error during the creation of the server\'s database.');
		}
		const data = snapshot.data();
		const {
			authorizedRoles,
		} = data;
		if (!authorizedRoles.length) {
			return console.warn('Reminder❗ The owner needs to add roles that is authorized to use the commands.');
		}
		return authorizedRoles;
	}
	catch (error) {
		console.error(error);
	}

};

const loadCommands = (client) => {
	const commandFolder = fs.readdirSync('./commands');
	let commandFilesAmount = 0;

	for (const folder of commandFolder) {
		const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const commandClass = require(`../commands/${folder}/${file}`);
			const command = new commandClass(client);
			client.commands.set(command.name, command);
			commandFilesAmount += 1;
			delete require.cache[commandClass];
		}
	}
	console.log(`Loaded ${commandFilesAmount} commands.`);
};

const loadEvents = (client) => {
	const eventsFolder = fs.readdirSync('./events/DiscordEvents').filter(file => file.endsWith('.js'));

	for (const file of eventsFolder) {
		const eventClass = require(`../events/${eventsFolder}/${file}`);
		const event = new eventClass(client);
		client[event.eventEmmiter](event.eventType, (...parameters) => event.execute(...parameters));
		delete require.cache[eventClass];
	}
	console.log(`Loaded ${eventsFolder.length} events.`);
};

module.exports = {
	convertUserRolesToArray: convertUserRolesToArray,
	checkPerm: checkPermission,
	getAuthRoles: retriveAuthroles,
	loadCommands: loadCommands,
	loadEvents: loadEvents,
	PlayerBanDocument: PlayerBanDocumentCreator,
};