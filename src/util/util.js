const fs = require('fs');
const readableToMs = require('readable-to-ms');
const dateformat = require('dateformat');
const GuildConfigDocument = require('@class/GuildConfigDocumentClass');
const {
	EmbededPermBanInfoMessage,
	EmbededTempBanInfoMessage,
} = require('@class/EmbededBanMessage');

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

const createBanInfoEmbed = (data, userImage, playerName) => {
	const {
		playerID,
		banReason,
		bannedBy,
		bannedAt,
		banType,
		bannedUntil,
	} = data;

	const formattedBanDate = dateformat(bannedAt, 'UTC:ddd, mmm dS, yyyy, HH:MM:ss TT Z');
	const formattedUnbanDate = dateformat(bannedUntil, 'UTC:ddd, mmm dS, yyyy, HH:MM:ss TT Z');
	const trimmedBanReason = trimString(banReason, 1024);
	const banInfoEmbed = banType == 'permaBan' ? new EmbededPermBanInfoMessage(
		formattedBanDate, bannedBy, playerName, playerID, trimmedBanReason, userImage,
	) : new EmbededTempBanInfoMessage(
		formattedBanDate, bannedBy, playerName, playerID, banReason, userImage, formattedUnbanDate,
	);
	return banInfoEmbed;
};

const getBanDurationAndBanReason = (args) => {
	const {
		ms: banDuration,
		text: banReason,
	} = readableToMs(args.join(' '));

	if (banDuration && banReason) {
		return [banDuration, banReason];
	}
	else {
		return [readableToMs(args.join(' ')), 'No ban reason was specified.'];
	}
};

const hasBanDuration = (args) => {
	const durationRE = /(\d+)\s*(milliseconds|millisecond|millis|milli|ms|seconds|second|secs|sec|s|minutes|minute|mins|min|m|hours|hour|hrs|hr|h|days|day|d|weeks|week|w|months|month|mo|years|year|y)\s*/gy;
	return args.some(arg => durationRE.test(arg));
};

const trimString = (str, max) => {
	return (str.length > max) ? `${str.slice(0, max - 3)}...` : str;
};

const parseToRoleId = (arg) => {
	return arg.match(/^<@&?(\d+)>$/g);
};

const roleExists = (guildRoles, roleId) => {
	return guildRoles.find(guildRole => `<@&${guildRole.id}>` == roleId);
};

const removeRoleFromCache = (roleId, cachedRoles) => {
	return cachedRoles.filter(role => role != roleId);
};

const createNewGuildDataBase = async (id, DB) => {
	try {
		await DB.collection(`guildDataBase:${id}`)
			.doc('guildConfigurations')
			.withConverter(guildConfigDocConverter)
			.create(new GuildConfigDocument);

		let successMessage = 'Collection containing your guild config has been created. ';
		successMessage += 'Be sure to add roles that\'s authorized to use the commands using the auth command!';

		console.log(`Database for guild ${id} has been created.`);
		return successMessage;
	}
	catch (error) {
		console.error(error);
		return error;
	}
};

const convertUserRolesToArray = (userRoles) => {
	return userRoles.map(role => `<@&${role.id}>`);
};

const checkPermission = (userRoles, authorizedRoles) => {
	return userRoles.some(userRole => authorizedRoles.includes(userRole));
};

const loadCommands = (client) => {
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
};

const loadEvents = (client) => {
	const eventsFolder = fs.readdirSync('./src/events/DiscordEvents').filter(file => file.endsWith('.js'));
	for (const eventFile of eventsFolder) {
		const eventClass = require(`@events/DiscordEvents/${eventFile}`);
		const event = new eventClass(client);
		client[event.eventEmmiter](event.eventType, (...parameters) => event.execute(...parameters));
		delete require.cache[eventClass];
	}
	console.log(`Loaded ${eventsFolder.length} events.`);
};

module.exports = {
	convertUserRolesToArray: convertUserRolesToArray,
	checkPerm: checkPermission,
	loadCommands: loadCommands,
	loadEvents: loadEvents,
	trimString: trimString,
	parseToRoleId: parseToRoleId,
	roleExists: roleExists,
	removeRoleFromCache: removeRoleFromCache,
	createNewGuildDataBase: createNewGuildDataBase,
	createBanInfoEmbed: createBanInfoEmbed,
	guildConfigDocConverter: guildConfigDocConverter,
	playerBanDocConverter: playerDocConverter,
	getBanDurationAndBanReason: getBanDurationAndBanReason,
	hasBanDuration: hasBanDuration,
};