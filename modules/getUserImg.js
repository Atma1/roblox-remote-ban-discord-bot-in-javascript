const fetch = require('node-fetch');
module.exports = {
	getUserImg: async (userId) => {
		try {
			const endpoint = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=48x48&format=Png&isCircular=false`;
			const response = await fetch(endpoint);
			const data = await response.json();
			if (data.errors) {
				const noImgFound = 'http://cdn.onlinewebfonts.com/svg/img_137275.png';
				return noImgFound;
			}
			const imageUrl = response.data[0].imageUrl;
			return imageUrl;
		}
		catch (error) {
			throw (`${error}.`);
		}
	},
};