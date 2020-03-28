var ytSearch = require("yt-search")

const searchYoutube = (keyword) => {
    return new Promise((resolve, reject) => {
        ytSearch(keyword)
            .then(results => {
                const videos = results.videos
                resolve(videos[0].url)
            })
            .catch(err=>{
                reject(err)
            })
    })
}

module.exports = {
    searchYoutube
}