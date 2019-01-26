module.exports = function(message, args, client) {
  
  switch(args[0]){
  
    case "all":
      if (client.functions.checkAdmin(message.author.id)){
        client.voiceConnections.forEach(connection => connection.disconnect())
      }
      else {
        message.channel.send("You need to be an admin in order to make the bot leave every server.")
      }

      break;

    default:
      let relevantConnection = client.voiceConnections.find((connection) => {
        return(connection.channel.guild == message.channel.guild)
      })

      try{
        if(relevantConnection){
          relevantConnection.disconnect()
        }
      }
      catch(error){console.log(error)} 
      break;

  }
  
};
