require('module-alias/register');
const admin = require('firebase-admin');
const serviceAccount = require('@serviceAccount');
const BotClient = require('@util/BotClient');
require('dotenv').config();
const token = process.env.token;

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const client = new BotClient(token);
client.startBot();