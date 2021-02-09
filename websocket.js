async function configureSocket(gateway, bot) {
    const sock = await gateway.connectWebSocket()

    sock.onMessage(async message => {
        console.log('send message from socket', message);
        await bot.sendMessage(message.userId, message.message);
    })
    
    sock.onFile(async file=>{
        console.log('send file from socket', file.userId, file.fileName);
        const buffer = Buffer.from(file.binary);
        const fileOptions = {
          filename: 'audioResponse',
          contentType: 'audio/mpeg',
        };
        await bot.sendVoice(file.userId, buffer);
    })
}

module.exports = {configureSocket}
