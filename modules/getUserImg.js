const axios = require('axios');

module.exports = {
	getUserImg: async (userId) => {
		try {
			const endpoint = `https://www.roblox.com/headshot-thumbnail/json?userId=${userId}&width=48&height=48&isCircular=false`;
			const response = await axios.get(endpoint);
			const {
				data,
			} = response;
			const {
				Url: userImage,
			} = data;
			return userImage;
		}
		catch (error) {
			throw (`${error}`);
		}
	},
};