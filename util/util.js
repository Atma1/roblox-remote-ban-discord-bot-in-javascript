const fs = require('fs');
const path = require('path');

const convertUserRolesToArray = (userRoles) => {
	const userRoleIds = [];
	userRoles.forEach(role => {
		userRoleIds.push(role.id);
	});
	return userRoleIds;
};

const checkPermission = (userRoles, authorizedRoles) => {
	return userRoles.some(userRole => authorizedRoles.includes(userRole));
};

const retriveAuthroles = async (message, guildId, DB) => {
	try {
		const snapshot = await DB.collection(`Server: ${guildId}`).doc(`Data for server: ${guildId}`).get();
		if (!snapshot.exists) {
			throw new Error('No authorized roles found.\nPossiblity of an error during the creation of the server\'s database.');
		}
		const data = snapshot.data();
		const {
			authorizedRoles,
		} = data;
		if (!authorizedRoles.length) {
			throw new Error('No authorized roles found.\nThe owner needs to add roles that is authorized to use the commands.');
		}
		return authorizedRoles;
	}
	catch (error) {
		console.error(error);
		return message.channel.send(`${error}`);
	}

};

const loadCommands = (client) => {
	const commandFolder = fs.readdirSync('./commands');
	let commandFilesAmount = 0;

	for (const folder of commandFolder) {
		const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const commandFile = require(`../commands/${folder}/${file}`);
			const command = new commandFile;
			client.commands.set(command.name, command);
			commandFilesAmount += 1;
			delete require.cache[commandFile];
		}
	}
	console.log(`Loaded ${commandFilesAmount} commands.`);
};

const loadEvents = (client) => {
	const eventsFolder = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

	for (const events of eventsFolder) {
		const {
			name: eventType,
		} = path.parse(events);
		const event = require(`../events/${events}`);
		client.on(eventType, event.execute.bind(null, client));
		delete require.cache[event];
	}
	console.log(`Loaded ${eventsFolder.length} events.`);
};

module.exports = {
	convertUserRolesToArray: convertUserRolesToArray,
	checkPerm: checkPermission,
	getAuthRoles: retriveAuthroles,
	loadCommands: loadCommands,
	loadEvents: loadEvents,
};