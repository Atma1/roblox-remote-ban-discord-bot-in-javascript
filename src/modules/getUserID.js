const axios = require('axios');

module.exports = {
	getUserId: async (username) => {
		try {
			const response = await axios
				.get(`https://api.roblox.com/users/get-by-username?username=${username}`);
			const {
				data,
			} = response;
			if (data.success == false) {
				const {
					errorMessage,
				} = data;
				throw new Error(errorMessage);
			}
			const {
				Id,
			} = data;
			return Id;
		}
		catch (error) {
			throw (`${error}`);
		}
	},
};