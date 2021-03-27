module.exports = {
	name : 'authorizebancommand',
	desc : 'authorize specific role to ban command',
	aliases : ['authban', 'permitban', 'authbanforrole'],
	usage : 'roletobeauth',
	args: true,
	// eslint-disable-next-line no-unused-vars
	async execute(msg, args, DB, FV) {
		console.log(new Date);
	},
};