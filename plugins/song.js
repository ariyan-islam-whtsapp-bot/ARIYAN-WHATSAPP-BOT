const fs = require("fs");
const path = require("path");
const axios = require("axios");
const nayan = require("nayan-media-downloaders");
const Youtube = require("youtube-search-api");
const ffmpeg = require("fluent-ffmpeg");


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
    name: "song",
    aliases: ["a"],
    permission: 0,
    prefix: true,
    description: "Search and download songs from YouTube (converted to MP3).",
    usage: ["song <keyword> - Search and download songs from YouTube."],
    categories: "Media",
    credit: "Developed by Mohammad Nayan",
  },

  
  start: async function ({ api, event, args }) {
    const { threadId, senderId, message } = event;

    if (!args.length) {
      await api.sendMessage(threadId, {
        text: "⚠️ Please provide a keyword. Example: song <keyword>",
      }, { quoted: message });
      return;
    }

    const keyword = args.join(" ");
    const results = await Youtube.GetListByKeyword(keyword, false, 6);

    const links = results.items.map((item) => item.id);
    const titles = results.items.map(
      (item, index) => `${index + 1}. ${item.title} (${item.length.simpleText})`
    );

    const messages = `🔎 Found ${links.length} results for "${keyword}":\n\n${titles.join(
      "\n"
    )}\n\nReply with a number (1-${links.length}) to download as MP3.`;

    const sentMessage = await api.sendMessage(event.threadId, { text: messages }, { quoted: message });

    global.client.handleReply.push({
      name: this.config.name,
      messageID: sentMessage.key.id,
      author: senderId,
      links,
    });
  },


  handleReply: async function ({ api, event, handleReply }) {
    if (event.senderId !== handleReply.author) return;
    const { threadId, senderId, body, message} = event;
    const { links, messageID } = handleReply;

    const selectedIndex = parseInt(body, 10) - 1;
    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= links.length) {
      await api.sendMessage(threadId, {
        text: `❌ Invalid selection. Reply with a number between 1 and ${links.length}.`,
      });
      return;
    }

    
    await api.sendMessage(threadId, {
      delete: { remoteJid: threadId, fromMe: false, id: messageID, participant: senderId },
    });

    const selectedLink = `https://www.youtube.com/watch?v=${links[selectedIndex]}`;
    const loadingMsg = await api.sendMessage(threadId, { text: "🎧 Downloading & converting to MP3..." });

    try {
      const data = await nayan.ytdown(selectedLink);
      const audioUrl = data.data.audio;
      const title = data.data.title;

      const filePath = path.join(__dirname, `cache/song_${Date.now()}.mp3`);

      
      await downloadAndConvertToMp3(audioUrl, filePath);

      
      await api.sendMessage(threadId, {
        delete: { remoteJid: threadId, fromMe: false, id: loadingMsg.key.id, participant: senderId },
      });

      
      await api.sendMessage(threadId, {
        text: `🎵 Title: ${title}\n✅ Converted to MP3 format.`,
      }, { quoted: message });

      
      await api.sendMessage(threadId, {
        audio: { url: filePath },
        mimetype: "audio/mpeg",
        fileName: title,
        ptt: false
      }, { quoted: message });

      
      fs.unlink(filePath, (err) => {
        if (err) console.error("❌ Failed to delete file:", err);
      });
    } catch (error) {
      console.error("❌ Error while downloading:", error);
      await api.sendMessage(threadId, { text: "❌ Failed to process the song. Try again later." }, { quoted: message });
    }
  },
};
