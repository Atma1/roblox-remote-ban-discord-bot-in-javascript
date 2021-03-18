const fart = '!surah 39:53';
const k = fart.slice(1).trim().split(' ');
const z = k.shift();
const x = k.toString().split(':');
const [phi, planck] = x;

// const s = 39;
// const ay = 53;
const link = `https://api.quran.com/api/v3/chapters/${x[0]}/verses/${x[1]}`;

const fartzone = {
	'zone': {
		'poop': {
			'diarea': 76,
		},
	},
	'fart': 'pooper',
};


const {
	zone: {
		poop: {
			diarea,
		},
	},
} = fartzone;


if (!isNaN(diarea)) {
	console.log('fartbomb');
}


if (z === 'surah') {
	if (!k.length) {
		console.log('you no argument noob!!11!!');
	}
	else {
		console.log(link, k, x, phi, planck);
	}
}

async function addtwonumber() {
	try {
		throw new Error('a is less than b noob!!!');
	}
	catch (error) {
		console.warn(error);
	}
}

addtwonumber();