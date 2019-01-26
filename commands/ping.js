module.exports = async function(message, args, client) {
  
  const response = await message.channel.send("Ping?");
  response.edit(`Pong! Latency is ${response.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  
};