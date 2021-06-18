const axios = require('axios');
const endpoint = 'https://www.roblox.com/headshot-thumbnail/json';
const blankImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Ic_check_box_outline_blank_48px.svg/48px-Ic_check_box_outline_blank_48px.svg.png';

module.exports = {
	/**
	 *
	 * @param {String} userId;
	 * @returns User Image Url
	 */
	getUserImg: async (userId) => {
		const params = {
			userId: `${userId}`,
			width: '60',
			height: '62',
			isCircular: 'true',
		};

		try {
			const response = await axios.get(endpoint, {
				timeout: 3000,
				params,
			});
			const { data } = response;
			const { Url: userImage } = data;
			return userImage;
		}
		catch (error) {
			console.error(error);
			return blankImage;
		}
	},
};