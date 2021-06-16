const axios = require('axios');
const endpoint = 'https://api.roblox.com/users/get-by-username';

module.exports = {
	/**
	 *
	 * @param {String} userId;
	 * @return UserId
	 */
	getUserId: async (userId) => {
		try {
			const response = await axios
				.get(endpoint, {
					timeout: 3000,
					params: {
						username: `${userId}`,
					},
				})
				.then(res => res.data);

			if (response.success == false) {
				const { errorMessage } = response;
				throw new Error(errorMessage);
			}

			const { Id } = response;

			return `${Id}`;
		}
		catch (error) {
			throw (`${error}`);
		}
	},
};