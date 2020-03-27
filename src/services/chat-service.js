const playPenKuyRai = (msg) => {
    if (msg.member.voice.channel && !msg.author.bot) {
        msg.member.voice.channel.join()
            .then(connection => {
                setTimeout(()=>{
                    connection.play('./sound/pen-kuy-rai.mp3')
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
        msg.channel.send('ไหนใครมีเหี้ยไร');
        msg.reply('มึงเหรอ');
    }
}