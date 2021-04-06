const fetch = require('node-fetch');
module.exports = {
	getUserImg: async (userId) => {
		try {
			const endpoint = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=48x48&format=Png&isCircular=false`;
			const response = await fetch(endpoint);
			const responseJSON = await response.json();
			if (responseJSON.errors) {
				const noImgFound = 'http://cdn.onlinewebfonts.com/svg/img_137275.png';
				return noImgFound;
			}
			const { data } = responseJSON;
			const imageUrl = data[0].imageUrl;
			return imageUrl;
		}
		catch (error) {
			throw new Error (`${error}`);
		}
	},
};