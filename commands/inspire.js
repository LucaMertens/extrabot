module.exports = function(message, args, client) {
  
  fetch('http://inspirobot.me/api?generate=true')
  .then(response => {
    return(response.text())
  })
  .then(text => {
    message.channel.send(text);
  })
  .catch(err => {
    console.log(err);
    message.channel.send("The following error occured:"+ err.message)
  });
  
}