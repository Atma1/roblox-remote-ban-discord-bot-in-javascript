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
					timeout: 3000,
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

			return toString(Id);
		}
		catch (error) {
			throw (`${error}`);
		}
	},
};