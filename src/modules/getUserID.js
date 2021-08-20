const axios = require('axios');
const endpoint = 'https://api.roblox.com/users/get-by-username';

module.exports = {
	/**
	 *
	 * @param {String} username;
	 * @return UserId
	 */
	getUserId: async (username) => {
		const response = await axios
			.get(endpoint, {
				timeout: 3000,
				params: {
					username: `${username}`,
				},
			})
			.then(res => res.data);

		if (response.success == false) {
			const { errorMessage } = response;
			if (errorMessage === 'User not found') {
				return false;
			}
			throw new Error(errorMessage);
		}

		const { Id } = response;

		return `${Id}`;
	},
};