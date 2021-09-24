const fs = require('fs');
const dateformat = require('dateformat');
const GuildConfigDocument = require('@class/Firestore Document/GuildConfigDocument');
const { PermBanInfoEmbed, TempBanInfoEmbed } = require('@class/Embed/EmbedBanMessage');

const playerDocConverter = {
	toFirestore: (banDocument) => {
		const { banDetails } = banDocument;
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
		const banDocument = snapshot.data(options);
		const { banDetails } = banDocument;
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
	toFirestore: (guildConfigDocument) => {
		const { guildConfig } = guildConfigDocument;
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

	const formattedBanDate = formatToUTC(bannedAt);
	const formattedUnbanDate = formatToUTC(bannedUntil);
	const trimmedBanReason = trimString(banReason, 1024);
	const banInfoEmbed = banType == 'permaBan' ?
		new PermBanInfoEmbed(
			formattedBanDate, bannedBy, playerName, playerID, trimmedBanReason, userImage,
		) : new TempBanInfoEmbed(
			formattedBanDate, bannedBy, playerName, playerID, banReason, userImage, formattedUnbanDate,
		);
	return banInfoEmbed;
};

const isBanDuration = (args) => {
	const splittedArgs = args.split(' ');
	if (splittedArgs.length >= 2) return false;
	const durationRE = /(\d+)\s*(milliseconds|millisecond|millis|milli|ms|seconds|second|secs|sec|s|minutes|minute|mins|min|m|hours|hour|hrs|hr|h|days|day|d|weeks|week|w|months|month|mo|years|year|y)\s*/gy;
	return splittedArgs.some(arg => durationRE.test(arg));
};

const trimString = (str, max) => {
	return str.length > max ? `${str.slice(0, max - 3)}...` : str;
};

const parseToRoleId = (arg) => {
	return arg.match(/^<@&?(\d+)>$/g);
};

const roleExistsInCache = (guildRolesCache, roleId) => {
	return guildRolesCache.find(guildRole => guildRole == roleId);
};

const removeRoleFromCache = (cachedRoles, roleId) => {
	return cachedRoles.filter(role => role != roleId);
};

const formatToUTC = (date) => {
	return dateformat(date, 'UTC:ddd, mmm dS, yyyy, HH:MM:ss TT Z');
};

const createNewGuildDataBase = async (guildId, firestore) => {
	try {
		await firestore.collection(`guildDataBase:${guildId}`)
			.doc('guildConfigurations')
			.withConverter(guildConfigDocConverter)
			.create(new GuildConfigDocument);

		let successMessage = 'Collection containing your guild config has been created. ';
		successMessage += 'Be sure to add roles that\'s authorized to use the commands using the auth command!';

		console.log(`Database for guild ${guildId} has been created.`);
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

const loadSlashCommands = async (client) => {
	const mainCommandFolder = fs.readdirSync('./src/commands');
	let commandFilesAmount = 0;
	const { slashCommands } = client;

	for (const commandFolders of mainCommandFolder) {
		const commandFiles = fs.readdirSync(`./src/commands/${commandFolders}`).filter(file => file.endsWith('.js'));
		for (const commandFile of commandFiles) {
			const commandClass = require(`@commands/${commandFolders}/${commandFile}`);
			const command = new commandClass(client);
			slashCommands.set(command.name, command);
			commandFilesAmount += 1;
			delete require.cache[commandClass];
		}
	}
	console.log(`Loaded ${commandFilesAmount} commands.`);
};

const setSlashCommands = async (guild, slashCommand, guildConfig) => {
	const slashCommandDatas = slashCommand.map(command => command.slashCommandData);
	const guildSlashCommands = await guild?.commands.set(slashCommandDatas);
	const slashCommandIds = guildSlashCommands.map(command => command.id);
	guildConfig.set('guildSlashCommandIds', slashCommandIds);
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
	formatToUTC: formatToUTC,
	checkPerm: checkPermission,
	loadCommands: loadCommands,
	loadSlashCommands: loadSlashCommands,
	setSlashCommands: setSlashCommands,
	loadEvents: loadEvents,
	trimString: trimString,
	parseToRoleId: parseToRoleId,
	roleExistsInCache: roleExistsInCache,
	removeRoleFromCache: removeRoleFromCache,
	createNewGuildDataBase: createNewGuildDataBase,
	createBanInfoEmbed: createBanInfoEmbed,
	guildConfigDocConverter: guildConfigDocConverter,
	playerBanDocConverter: playerDocConverter,
	isBanDuration: isBanDuration,
};