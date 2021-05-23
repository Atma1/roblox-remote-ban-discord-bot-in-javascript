process.on('uncaughtException', error => {
	console.error('UncaughtExecption:', error);
});

process.on('unhandledRejection', error => {
	console.error('UnhandledRejection:', error);
});
