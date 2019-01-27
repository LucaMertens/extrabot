//Init Drobbox
let Dropbox = require("dropbox").Dropbox;
let dbx = new Dropbox({fetch: require('isomorphic-fetch'), accessToken: process.env.DROPBOXTOKEN});


//Start of bot
const config = require("./config.json");
const Discord = require('discord.js');
const client = new Discord.Client({disabledEvents: ["TYPING_START"]});
client.functions = require('./functions.js');
client.theme = true;


//Start of Event-Listeners
client.on("ready", () => {
   console.log("Extrabot is ready.");
  client.user.setActivity("Prefix:" + config.prefix, { type: 'LISTENING' });
});
 

client.on("message", async message => {
  if (message.author.bot) {  //ignore other Discord-bots
    return;
  }
  else if (message.content.toLowerCase().startsWith(config.prefix)) {
    
    let args = message.content.substring(config.prefix.length).split(/ +/g); //Remove the prefix, split the message-content into an array
    let cmd = args.shift().toLowerCase(); //remove the first element from args and return it as the cmd variable
    
    try {
      require("./commands/"+ cmd)(message, args, client, dbx); //Try to load the command
    }
    catch(error){
      if (error.message.startsWith("Cannot find module './commands/")) {
        message.channel.send("Sorry, this command doesn't exist.");
      }
      else {
        console.log(error);
        message.channel.send("An error occured. Please try again later.")
      }
    }

  }
});


client.on("voiceStateUpdate", async (oldMember, newMember) => { //The event "voiceStateUpdate" is called on multiple occasions, e.g. muting and unmuting
  let start = Date.now();
  if (
    client.theme &&
    !newMember.user.bot && //Ignore other bots
    oldMember.voiceChannel != newMember.voiceChannel && //Only react if the user changed or joined a voiceChannel
    newMember.voiceChannel != undefined && //If the users "new" voiceChannel is undefined, they left --> Ignore
    newMember.voiceChannel.joinable
  ) {
    const broadcast = client.createVoiceBroadcast();
    
    dbx.filesListFolder({"path": "/themes/" + newMember.id})
    .then(folder => {
      return (dbx.filesGetTemporaryLink({"path":"/themes/" + newMember.id + "/" + folder.entries[Math.floor(Math.random() * folder.entries.length)].name})); //The promise resolves to a themefile randomly choosen from all the users themefile
    })
    .then(themefile => {
      broadcast.playArbitraryInput(themefile.link);
      console.log(`Playing ${themefile.metadata.name} (User: ${newMember.user.username}).\nDelay: ${Date.now() - start}ms.`);
    })
    .catch(error => console.log(error));
    
    newMember.voiceChannel.join()
    .then(connection => {
      connection.playBroadcast(broadcast);
    })
    .catch(error => console.log(error));
    
  }
  else if (
    newMember.voiceChannel == undefined &&
    client.voiceChannel.members.filter(member => !member.user.bot).size == 0 //If noone is in the voiceChannel except for bots, leave the channel
  ){
    client.voiceChannel.leave();
  }
  
});


client.login(process.env.TOKEN);
