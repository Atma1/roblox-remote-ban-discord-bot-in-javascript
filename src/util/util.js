const fs = require('fs');
const readableToMs = require('readable-to-ms');
const GuildConfigDocument = require('@class/GuildConfigDocumentClass');

const playerDocConverter = {
	toFirestore: (Doc) => {
		const { banDetails } = Doc;
		return {
			banDetails: {
				playerID: banDetails.playerID,
				playerName: banDetails.playerName,
				banReason: banDetails.banReason,
				banType: banDetails.banType,
				bannedBy: banDetails.bannedBy,
				bannedAt: banDetails.bannedAt,
				bannedUntil: banDetails.bannedUntil,
			},
		};
	},
	fromFirestore: (snapshot, options) => {
		const banDoc = snapshot.data(options);
		const { banDetails } = banDoc;
		return {
			playerID: banDetails.playerID,
			playerName: banDetails.playerName,
			banReason: banDetails.banReason,
			banType: banDetails.banType,
			bannedBy: banDetails.bannedBy,
			bannedAt: banDetails.bannedAt,
			bannedUntil: banDetails.bannedUntil,
		};
	},
};

const guildConfigDocConverter = {
	toFirestore: (Doc) => {
		const { guildConfig } = Doc;
		return {
			guildConfig: {
				authorizedRoles: guildConfig.authorizedRoles,
				defaultPrefix: guildConfig.defaultPrefix,
			},
		};
	},
	fromFirestore: (snapshot, options) => {
		const guildConfigDoc = snapshot.data(options);
		const { guildConfig } = guildConfigDoc;
		return {
			authorizedRoles: guildConfig.authorizedRoles,
			defaultPrefix: guildConfig.defaultPrefix,
		};
	},
};

const seperateDurationAndBanReason = (args) => {
	const { ms:banDuration, text:banReason } = readableToMs(args.join(' '));
	return [banDuration, banReason];
};

const checkIfHasBanDuration = (args) => {
	const durationRE = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y|dcd|c)?$/ig;
	return args.some(arg => durationRE.test(arg));
};

const trimString = (str, max) => {
	return ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
};

const parseToRoleId = (arg) => {
	return arg.match(/[0-9]\d+/g);
};

const checkIfRoleExists = (roleId, guildRoles) => {
	return guildRoles.find(guildRole => guildRole.id == roleId);
};

const createNewGuildDataBase = async (id, DB) => {
	try {
		await DB.collection(`guildDataBase:${id}`)
			.doc('guildConfigurations')
			.withConverter(guildConfigDocConverter)
			.create(new GuildConfigDocument);

		let successMessage = 'Collection containing your guild config has been created.';
		successMessage += ' Be sure to add roles is authorized to use the commands!';

		console.log(`Database for guild ${id} has been created.`);
		return successMessage;
	}
	catch (error) {
		console.error(error);
		return error;
	}
};

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

const loadCommands = (client) => {
	try {
		const mainCommandFolder = fs.readdirSync('./src/commands');
		let commandFilesAmount = 0;

		for (const commandFolders of mainCommandFolder) {
			const commandFiles = fs.readdirSync(`./src/commands/${commandFolders}`).filter(file => file.endsWith('.js'));
			for (const commandFile of commandFiles) {
				const commandClass = require(`@commands/${commandFolders}/${commandFile}`);
				const command = new commandClass(client);
				client.commands.set(command.name, command);
				commandFilesAmount += 1;
				delete require.cache[commandClass];
			}
		}
		console.log(`Loaded ${commandFilesAmount} commands.`);
	}
	catch (error) {
		console.error(error);
	}
};

const loadEvents = (client) => {
	try {
		const eventsFolder = fs.readdirSync('./src/events/DiscordEvents').filter(file => file.endsWith('.js'));
		for (const eventFile of eventsFolder) {
			const eventClass = require(`@events/DiscordEvents/${eventFile}`);
			const event = new eventClass(client);
			client[event.eventEmmiter](event.eventType, (...parameters) => event.execute(...parameters));
			delete require.cache[eventClass];
		}
		console.log(`Loaded ${eventsFolder.length} events.`);
	}
	catch (error) {
		console.error(error);
	}
};

module.exports = {
	convertUserRolesToArray: convertUserRolesToArray,
	checkPerm: checkPermission,
	loadCommands: loadCommands,
	loadEvents: loadEvents,
	trimString: trimString,
	checkIfRoleId: parseToRoleId,
	checkIfRoleExists: checkIfRoleExists,
	createNewGuildDataBase: createNewGuildDataBase,
	guildConfigDocConverter: guildConfigDocConverter,
	playerBanDocConverter: playerDocConverter,
	seperateDurationAndBanReason: seperateDurationAndBanReason,
	checkIfHasBanDuration: checkIfHasBanDuration,
};