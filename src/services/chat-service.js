const playPenKuyRai = (msg) => {
    if (msg.member.voice.channel && !msg.author.bot) {
        msg.member.voice.channel.join()
            .then(connection => {
                setTimeout(()=>{
                    connection.play('./src/sound/pen-kuy-rai.mp3')                    
                }, 200)
            })
            .catch(err => {
                console.log(err);
            })
    }
}

module.exports = (msg) => {
    const message = msg.content;
    if (message.includes("ควย")){
        msg.reply('อะไรสิ๊');
        playPenKuyRai(msg);
    }
}