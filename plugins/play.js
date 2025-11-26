const fs = require("fs");
const path = require("path");
const axios = require("axios");
const nayan = require("nayan-media-downloaders");
const Youtube = require("youtube-search-api");
const ffmpeg = require("fluent-ffmpeg")


async function downloadAndConvertToMp3(url, filePath) {
  return new Promise((resolve, reject) => {
    const tempFile = filePath.replace(".mp3", ".tmp");

    axios({
      method: "get",
      url,
      responseType: "stream",
    })
      .then((response) => {
        const writer = fs.createWriteStream(tempFile);
        response.data.pipe(writer);

        writer.on("finish", () => {
          
          ffmpeg(tempFile)
            .toFormat("mp3")
            .on("end", () => {
              fs.unlinkSync(tempFile); 
              resolve(filePath);
            })
            .on("error", reject)
            .save(filePath);
        });

        writer.on("error", reject);
      })
      .catch(reject);
  });
}

module.exports = {
  config: {
    name: "play",
    aliases: [],
    permission: 0,
    prefix: true,
    description: "Play a song directly from YouTube (first search result).",
    usage: [`${global.config.PREFIX}play <keyword> - Play song directly.`],
    categories: "Media",
    credit: "Developed by Mohammad Nayan",
  },


  start: async function ({ api, event, args }) {
    const { threadId, senderId, message } = event;

    const keyword = args.join(" ");

    if (!keyword) {
      await api.sendMessage(threadId, {
        text: `⚠️ Please provide a song name. Example: ${global.config.PREFIX}play ghum odd`,
      }, { quoted: message });
      return;
    }



    try {

      const results = await Youtube.GetListByKeyword(keyword, false, 1);
      if (!results.items.length) {
        await api.sendMessage(threadId, {
          text: "❌ No results found on YouTube.",
        }, { quoted: message });
        return;
      }

      const videoId = results.items[0].id;
      const title = results.items[0].title;
      const selectedLink = `https://www.youtube.com/watch?v=${videoId}`;

      const loadingMsg = await api.sendMessage(threadId, {
        text: `🎧 Searching & downloading: *${title}*`,
      }, { quoted: message });


      const data = await nayan.ytdown(selectedLink);
      const audioUrl = data.data.audio;

      const filePath = path.join(__dirname, `cache/play_${Date.now()}.mp3`);


      await downloadAndConvertToMp3(audioUrl, filePath);


      await api.sendMessage(threadId, {
        delete: {
          remoteJid: threadId,
          fromMe: false,
          id: loadingMsg.key.id,
          participant: senderId,
        },
      });


      await api.sendMessage(
        threadId,
        {
          audio: { url: filePath },
          mimetype: "audio/mpeg",
          fileName: `${title}.mp3`,
          ptt: false,
        },
        { quoted: message }
      );


      fs.unlink(filePath, (err) => {
        if (err) console.error("❌ Failed to delete file:", err);
      });
    } catch (error) {
      console.error("❌ Error in /play:", error);
      await api.sendMessage(threadId, {
        text: "❌ Failed to play the song. Try again later.",
      });
    }
  },
};
