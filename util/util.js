const convertUserRoleToArray = (userRoles) => {
	const roleIds = [];
	userRoles.forEach(role => {
		roleIds.push(role.id);
	});
	console.log(roleIds, 'foo');
	return roleIds;
};

const checkPermission = (userRoles, authorizedRoles) => {
	try {
		console.log(userRoles, 'tell');
		return userRoles.some(userRole => authorizedRoles.includes(userRole));
	}
	catch (error) {
		throw new Error(error);
	}
};

const retriveAuthroles = async (guildId, DB) => {
	try {
		const snap = await DB.collection('Guilds-Server').doc(`Server: ${guildId}`).get();
		if (!snap.exists) {
			throw ('No authorized role found.');
		}
		const data = snap.data();
		const { authorizedRoles } = data;
		console.log(typeof (authorizedRoles), authorizedRoles, 'retelo');
		return authorizedRoles;
	}
	catch (error) {
		throw new Error(error);
	}

};

module.exports = {
	convertToArray: convertUserRoleToArray,
	checkPerm: checkPermission,
	getAuthRoles: retriveAuthroles,
};