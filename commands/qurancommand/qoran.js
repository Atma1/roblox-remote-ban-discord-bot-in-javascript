const fetch = require('node-fetch');

module.exports = {
	name : 'qoran',
	desc : 'send surah from verse',
	args : true,
	cooldown : 5,
	async execute(message, args) {
		console.log(args);
		const verseAndSurah = args.toString().split(':');
		const [chapterNumber, verseNumber] = verseAndSurah;
		const link = `https://api.quran.com/api/v3/chapters/${chapterNumber}/verses/${verseNumber}`;
		console.log(link);
		const response = await fetch(link).then(res => res.json());
		const { verse: { text_madani } } = response;
		return message.channel.send(text_madani);
	},
};