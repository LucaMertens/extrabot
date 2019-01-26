module.exports = function(message, args, client) {
  
  if (client.functions.checkAdmin(message.author.id)){
    message.channel.send("Goodbye, cruel world!");
    console.log("Disconnecting")
    client.destroy();
  }
  else {
    message.channel.send("You need to be an admin in order to stop the bot.")
  }
  
};