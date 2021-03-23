const fetch = require('node-fetch');
module.exports = {
	getUserImg: async (userId) => {
		try {
			const response = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=48x48&format=Png&isCircular=false`)
				.then(res => res.json())
				.catch(err => {
					throw new Error(err);
				});
			if (response.errors) {
				const noImgFound = 'http://cdn.onlinewebfonts.com/svg/img_137275.png';
				return noImgFound;
			}
			const imageUrl = response.data[0].imageUrl;
			return imageUrl;
		}
		catch (error) {
			throw (`${error} for player with the username ${userId}.`);
		}
	},
};