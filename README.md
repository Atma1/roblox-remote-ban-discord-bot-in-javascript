# Roblox Remote Ban Discord Bot in JavaScript

A discord bot made in JavaScript that will enable the capabilty of remote ban using Discord.js, Firebase Firestore for the database. You will need to create a connection from roblox to your firestore to fully use this bot.

## Getting Started

Before starting I need to tell you something the process of setting up the bot might seems very complicated and require a great amount of techincal knowledge but fear not as long as you have the motivation to keep pushing and go forward it will not intimidate you.

### Prerequisites

The things you need before installing the bot.

* Basic understanding of JavaScript (In case of bugs)
* Firebase Firestore account (The spark plan is free)
* Discord bot (Head to the discord dev portal to create one and make sure the bot is allowed to create slash command!)
* Have Node.js installed on your device

### Installation

1. Create a discord bot by going to discord developer portal and create a Firebase Firestore account.
2. Get an IDE or code editor-e.g. Visual Code Studio or Repl.
3. Clone the repository.
4. Get the .env file found near the bottom of this text then extract it from the .zip file and insert it to your bot folder.
5. In the .env file add your bot token.
6. Download your firebase admin SDK JSON by going to firebase project settings and look for a tab called service accounts then click create service account.
7. Insert the SDK to the bot folder and rename it to serviceAccount and keep the .json.
8. Install the dependencies. If you are using a code editor type in the shell/command prompt npm i or if you are using Repl it'll auto install all the dependencies after you've run the bot.
9. Deploy the bot to your server using the bot's invite link located in your discord developer portal and make sure the bot is allowed to create slash command!
10. Make sure in firebase firestore rules tab anyone can read the database otherwise you'll have to create a system on the roblox side to retrive the database authorization token (bit hard but worth the extra security).
11. Create a connection from your roblox game to your Firebase Firestore database using firebase Firestore REST API.
12. Add role for permission restricted command by using /auth command.
13. Type /help for all of the bot commands.
14. If the slash command is not avaible there's a big chance that the bot is not allowed to create slash command.

## Additional Documentation

* Firebase Firestore documentation: https://firebase.google.com/docs/firestore
* Firebase Firestore REST API link: https://firebase.google.com/docs/firestore/use-rest-api
* Discord.js documentation: https://discord.js.org

# File

.env File: 
[env.zip](https://github.com/Atma1/remote-ban-discord-bot-in-jawascript/files/6277583/env.zip)
## Support 
Need help or have a question? HMU on Discord FreshFea#8153
