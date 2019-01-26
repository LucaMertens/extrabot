module.exports = function(message, args, client) {
  
  try{client.voiceChannel.leave();}
  catch(err){console.log(err)}
  
};