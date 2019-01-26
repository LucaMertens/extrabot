const config = require("./../config.json")

module.exports = function(message, args, client, dbx) {
  
  if (args[0] == "on" && client.theme === false) {
     client.theme = true;
     message.channel.send("Theme-Playback turned on!");
   }
   else if (args[0] == "off" && client.theme === true) {
     client.theme = false;
     message.channel.send("Theme-Playback turned off.");
   }
   else if (args[0] == undefined){
     message.channel.send("Usage:/n Extratheme on / Extratheme off: Turns the Theme-Playback on or off/n Extratheme upload: Adds a theme for yourself. If you include a mention, you can also upload it for someone else.");
   }
   else if (args[0] == "upload"){
     if (message.attachments.size == 0){
       message.channel.send("No attachment found.")
       return;
     }
     else {
       let att = message.attachments.first();
       let filetype = att.url.split(".").pop().toLowerCase();

       if (!config.supportedFiletypes.includes(filetype)) {
           message.channel.send(`Sorry, this filetype (${filetype}) is currently not supported`);
       }
       else{
         let recipient;
         if (message.mentions.users.first()) {
           if (client.functions.checkAdmin(message.author.id) || message.mentions.users.first().id == message.author.id){
             recipient = message.mentions.users.first();
           }
           else {
             message.channel.send("You need to be an admin in order to upload themes for other people.")
             return;
           }
         }
         else {
           recipient = message.author;
         }
         fetch(att.url).then(data => {
           dbx.filesUpload({"path": "/themes/" + recipient.id + "/" + att.filename, "contents":data.body})
           message.channel.send(`The theme ${att.filename} has been uploaded for the user ${recipient}`);
         });
       }
     }
   }
  
}; 