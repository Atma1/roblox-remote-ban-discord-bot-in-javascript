const { EmbededPermBanInfoMessage } = require('@class/EmbededBanMessage');
const DataBaseRelatedCommandClass = require('@class/DataBaseRelatedCommandClass');
const PlayerBanDocument = require('@class/PlayerBanDocumentClass');
const PlayerProfileButton = require('@class/PlayerProfileButton');
const { getUserId } = require('@modules/getUserId');
const { getUserImg } = require('@modules/getUserImg');
const { trimString:trim, formatToUTC } = require('@util/util');

module.exports = class PermBanCommand extends DataBaseRelatedCommandClass {
	constructor(botClient) {
		super(
			botClient,
			'ban',
			'ban player until who know when. to edit the ban, just rerun the command',
			'<playerName> <banReason(Optional)>', {
				aliases: ['addban', 'banplayer', 'bn', 'permban', 'pb'],
				example: 'ban joemama joemama is too fat',
				cooldown: '5s',
				args: true,
				permission: true,
				reqarglength: 1,
			},
		);
	}
	async execute(message, args) {
		const { id:guildId } = message.channel.guild;
		const { tag: bannedBy } = message.author;
		const playerName = args.shift();
		const bannedAt = Date.now();
		const banReason = args ? args.join(' ') : 'No ban reason was specified';
		const formattedBanDate = formatToUTC(bannedAt);

		try {
			const playerId = await getUserId(playerName);
			const playerBanDoc = new PlayerBanDocument(
				playerId, playerName, banReason, bannedBy, 'permaBan', bannedAt,
			);
			const [playerImage] = await Promise.all([
				getUserImg(playerId),
				this.addPlayerToBanList(playerBanDoc, guildId),
			]);
			const banInfoEmbed = new EmbededPermBanInfoMessage(
				formattedBanDate, bannedBy, playerName, playerId, trim(banReason, 1024), playerImage,
			);
			const playerProfileButton = new PlayerProfileButton(playerId);
			return message.channel.send({ content:`\`${playerName} has been banned.\``, embeds: [banInfoEmbed], components: [[playerProfileButton]] });
		}
		catch (error) {
			console.error(error);
			return message.reply({ content:`There was an error while banning the player!\n${error}`, allowedMentions: { repliedUser: true } });
		}
	}
};