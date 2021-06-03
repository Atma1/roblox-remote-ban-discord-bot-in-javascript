const axios = require('axios');
const endpoint = 'https://www.roblox.com/headshot-thumbnail/json';

module.exports = {
	/**
	 *
	 * @param {String} userId;
	 * @returns User Image Url
	 */
	getUserImg: async (userId) => {
		const params = {
			userId: userId,
			width: '48',
			height: '48',
			isCircular: 'false',
		};
		try {
			const response = await axios.get(endpoint, {
				timeout: 5000,
				params,
			});
			const { data } = response;
			const { Url: userImage } = data;
			return userImage;
		}
		catch (error) {
			throw (`${error}`);
		}
	},
};