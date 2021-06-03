const axios = require('axios');
const endpoint = 'https://api.roblox.com/users/get-by-username';

module.exports = {
	/**
	 *
	 * @param {String} requestedUserName;
	 * @return UserId: string
	 */
	getUserId: async (requestedUserName) => {
		try {
			const response = await axios
				.get(endpoint, {
					timeout: 5000,
					params: {
						username: `${requestedUserName}`,
					},
				})
				.then(res => res.data);

			if (response.success == false) {
				const { errorMessage } = response;
				throw new Error(errorMessage);
			}

			const { Id } = response;
			return Id;
		}
		catch (error) {
			throw (`${error}`);
		}
	},
};