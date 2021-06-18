require('module-alias/register');
require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require('@serviceAccount');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const BotClient = require('@class/BotClient');
const token = process.env.token;
const client = new BotClient(token);

client.startBot();