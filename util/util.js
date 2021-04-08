const convertUserRoleToArray = (userRoles) => {
	const roleIds = [];
	userRoles.forEach(role => {
		roleIds.push(role.id);
	});
	return roleIds;
};

const checkPermission = (userRoles, authorizedRoles) => {
	try {
		return userRoles.some(userRole => authorizedRoles.includes(userRole));
	}
	catch (error) {
		throw new Error(error);
	}
};

const retriveAuthroles = async (guildId, DB) => {
	try {
		const snap = await DB.collection(`Server: ${guildId}`).doc(`Data for server: ${guildId}`).get();
		if (!snap.exists) {
			throw new Error('No authorized roles found.\nPossiblity of an error during the creation of the server\'s database.');
		}
		const data = snap.data();
		const { authorizedRoles } = data;
		if (!authorizedRoles.length) {
			throw new Error('No authorized roles found.\nThe owner needs to add roles that are authorized to use the commands.');
		}
		return authorizedRoles;
	}
	catch (error) {
		throw (`${error}`);
	}

};

module.exports = {
	convertToArray: convertUserRoleToArray,
	checkPerm: checkPermission,
	getAuthRoles: retriveAuthroles,
};