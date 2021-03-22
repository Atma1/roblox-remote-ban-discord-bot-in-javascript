const fetch = require('node-fetch');
module.exports = {
	getUserImg: async (userId) => {
		try {
			const response = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=48x48&format=Png&isCircular=false`)
				.then(res => res.json())
				.catch(err => {
					throw new Error(err);
				});
			if (response.success == false) {
				const { errorMessage } = response;
				throw new Error(errorMessage);
			}
			const { Id } = response;
			return Id;
		}
		catch (error) {
			throw (`${error} for player with the username ${username}.`);
		}
	},
};