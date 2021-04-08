module.exports = {
	name: 'poop',
	desc: 'make poop',
	execute(message) {
		console.log('bar');
		return message.reply('pooper');
	},
};