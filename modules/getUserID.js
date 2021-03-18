const fetch = require('node-fetch');
module.exports = {
	getUserID: async (username) => {
		try {
			const response = await fetch(`https://api.roblox.com/users/get-by-username?username=${username}`)
				.then(res => res.json())
				.catch(err => {
					throw new Error(err);
				});
			if (response.success == false) {
				const { errorMessage } = response;
				throw new Error(errorMessage);
			}
			const { Id } = response;
			console.log(Id);
			return Id;
			// fartzone
			// pp extend
		}
		catch (error) {
			throw (`${error} for player with the username ${username}.`);
		}
	},
};