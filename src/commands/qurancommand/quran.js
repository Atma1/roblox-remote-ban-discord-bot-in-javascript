const { MessageEmbed } = require('discord.js');
const CommandClass = require('@class/CommandClass');
const { trimString:trim } = require('@util/util');
const axios = require('axios');
const endPoint = 'https://api.quran.sutanlab.id/surah';

module.exports = class QuranCommand extends CommandClass {
	constructor(botClient) {
		super(
			botClient,
			'quran',
			'get the specified chapter from the specified quran verse',
			'<chapterNumber:verseNumber>', {
				example : 'quran 39:53',
				args : true,
				cooldown : '5s',
			});
	}
	async execute(message, args) {
		try {
			const [chapterNumber, verseNumber] = args.toString().split(':');
			const response = await axios.get(`${endPoint}/${chapterNumber}/${verseNumber}`)
				.then(res => res.data);
			const { data: { text: { arab } } } = response;
			const { data: { text: { transliteration: { en:transliteral } } } } = response;
			const { data: { translation: { en } } } = response;
			const { data: { audio: { primary } } } = response;
			const embed = new MessageEmbed()
				.setColor ('#EFFF00')
				.setTitle (`Quran ${args} Click for audio`)
				.setURL (primary)
				.addFields (
					{ name: 'Arabic', value: trim(arab, 1024) },
					{ name: 'Transliteration', value: trim(transliteral, 1024) },
					{ name: 'Translation (EN)', value: trim(en, 1024) },
					{ name: 'REST API', value: endPoint },
				);
			return message.channel.send({ embed:embed });
		}
		catch(error) {
			console.error(error);
			return message.channel.send({ content:error });
		}
	}
};