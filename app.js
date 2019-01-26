//pinging the bot every 4.5 mins
const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  //console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT); 
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 270000);


//Init Drobbox
let Dropbox = require("dropbox").Dropbox;
let dbx = new Dropbox({fetch: require('isomorphic-fetch'), accessToken: process.env.DROPBOXTOKEN});


//Start of bot
const config = require("./config.json");
const Discord = require('discord.js');
const client = new Discord.Client();
client.functions = require('./functions.js');
client.theme = true;


//Define Event-Listeners
client.on("ready", () => {
   console.log("Extrabot is ready.");
  client.user.setActivity("Prefix:" + config.prefix, { type: 'LISTENING' });
});
 

client.on("message", async message => {
  if (message.author.bot) {  //ignore bots
    return;
  }
  else if (message.content.toLowerCase().startsWith(config.prefix)) {
    
    let args = message.content.substring(config.prefix.length).split(/ +/g); //Remove the prefix, split the message-content into an array
    let cmd = args.shift().toLowerCase(); //remove the first element from args and return it as the cmd variable
    
    try {
      require("./commands/"+ cmd)(message, args, client, dbx);
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


client.on("voiceStateUpdate", async (oldMember, newMember) => {
  let start = Date.now();
  if (
    client.theme &&
    !newMember.user.bot &&
    oldMember.voiceChannel != newMember.voiceChannel &&
    newMember.voiceChannel != undefined &&
    newMember.voiceChannel.joinable
  ) {
    const brotcast = client.createVoiceBroadcast();
    //try {brotcast.end()} catch(err){console.error(err)};  
    let voiceChannel = newMember.voiceChannel;
    
    dbx.filesListFolder({"path": "/themes/" + newMember.id})
    .then(folder => {
      return (dbx.filesGetTemporaryLink({"path":"/themes/" + newMember.id + "/" + folder.entries[Math.floor(Math.random() * folder.entries.length)].name})); 
    })
    .then(themefile => {
      brotcast.playArbitraryInput(themefile.link);
      //console.log(themefile.link);
      console.log(`Playing ${themefile.metadata.name} (User: ${newMember.user.username}).\nDelay: ${Date.now() - start}ms.`);
    })
    .catch(error => console.log(error));
    
    voiceChannel.join()
    .then(connection => {
      client.voiceChannel = voiceChannel;
      connection.playBroadcast(brotcast);
    })
    .catch(error => console.log(error));
    
  }
  else if (
    newMember.voiceChannel == undefined &&
    client.voiceChannel.members.size == 1
  ){
    client.voiceChannel.leave();
  }
  
});


client.login(process.env.TOKEN);