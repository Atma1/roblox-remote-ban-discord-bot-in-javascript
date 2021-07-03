const { EmbededPermBanInfoMessage } = require('@class/EmbededBanMessage');
const DataBaseRelatedCommandClass = require('@class/DataBaseRelatedCommandClass');
const PlayerBanDocument = require('@class/PlayerBanDocumentClass');
const { trimString:trim } = require('@util/util');

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
		const formattedBanDate = this.dateformat(bannedAt);

		try {
			const playerId = await this.getUserId(playerName);
			const playerBanDoc = new PlayerBanDocument(
				playerId, playerName, banReason, bannedBy, 'permaBan', bannedAt,
			);

			const [playerImage] = await Promise.all([
				this.getUserImg(playerId),
				this.addPlayerToBanList(playerBanDoc, guildId),
			]);

			const banInfoEmbed = new EmbededPermBanInfoMessage(
				formattedBanDate, bannedBy, playerName, playerId, trim(banReason, 1024), playerImage,
			);
			return message.channel.send({ content:`\`${playerName} has been banned.\``, embed: banInfoEmbed });
		}
		catch (error) {
			console.error(error);
			return message.reply({ content:`there was an error while banning the player!\n${error}`, allowedMentions: { repliedUser: true } });
		}
	}
};