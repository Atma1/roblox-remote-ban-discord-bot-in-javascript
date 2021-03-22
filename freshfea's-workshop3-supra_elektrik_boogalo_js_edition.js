const fart = '!surah 39:53';
const k = fart.slice(1).trim().split(' ');
const z = k.shift();
const x = k.toString().split(':');
const [phi, planck] = x;
const link = `https://api.quran.com/api/v3/chapters/${x[0]}/verses/${x[1]}`;
const aa = ['poop', 'ball', 'eeeeee', 'ballin'];

const loopAll = (...deta) => {
	console.log(deta);
};
loopAll(...aa);

if (z === 'surah') {
	if (!k.length) {
		console.log('you no argument noob!!11!!');
	}
	else {
		console.log(link, k, x, phi, planck);
	}
}
