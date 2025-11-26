module.exports = {
  config: {
    name: "video2",
    aliases: ["album"],
    version: "1.0.0",
    permission: 0,
    prefix: true,
    credits: "Nayan",
    description: "Random video",
    category: "video",
    usages: [".video2"],
    cooldowns: 5
  },

  start: async function ({ api, event }) {
    const msg = `====「 𝐕𝐈𝐃𝐄𝐎 」====\n━━━━━━━━━━━━━
𝟙. 𝐋𝐎𝐕𝐄 𝐕𝐈𝐃𝐄𝐎 💞
𝟚. 𝐂𝐎𝐔𝐏𝐋𝐄 𝐕𝐈𝐃𝐄𝐎 💕
𝟛. 𝐒𝐇𝐎𝐑𝐓 𝐕𝐈𝐃𝐄𝐎 📽
𝟜. 𝐒𝐀𝐃 𝐕𝐈𝐃𝐄𝐎 😔
𝟝. 𝐒𝐓𝐀𝐓𝐔𝐒 𝐕𝐈𝐃𝐄𝐎 📝
𝟞. 𝐒𝐇𝐀𝐈𝐑𝐈
𝟟. 𝐁𝐀𝐁𝐘 𝐕𝐈𝐃𝐄𝐎 😻
𝟠. 𝐀𝐍𝐈𝐌𝐄 𝐕𝐈𝐃𝐄𝐎
𝟡. 𝐇𝐔𝐌𝐀𝐈𝐘𝐔𝐍 𝐅𝐎𝐑𝐈𝐃 𝐒𝐈𝐑 ❄
𝟙𝟘. 𝐈𝐒𝐋𝐀𝐌𝐈𝐊 𝐕𝐈𝐃𝐄𝐎 🤲

===「 𝟏𝟖+ 𝐕𝐈𝐃𝐄𝐎 」===\n━━━━━━━━━━━━━
𝟙𝟙. 𝐇𝐎𝐑𝐍𝐘 𝐕𝐈𝐃𝐄𝐎 🥵
𝟙𝟚. 𝐇𝐎𝐓 🔞
𝟙𝟛. 𝐈𝐓𝐄𝐌

👉 Reply with a number to choose category.`;

    const sent = await api.sendMessage(event.threadId, { text: msg }, { quoted: event.message });

    global.client.handleReply.push({
      name: this.config.name,
      messageID: sent.key.id,
      author: event.senderId,
      type: "choose"
    });
  },

  handleReply: async function ({ api, event, handleReply }) {
    if (event.senderId !== handleReply.author) return;
    const choice = handleReply.choice || event.body.trim();

    try {
      const { p, h } = await linkanh(choice);
      const response = await p.get(h);
      const data = response.data.data;
      const cap = response.data.nayan;
      const cn = response.data.count;

      const stream = (await p.get(data, { responseType: "stream" })).data;

      const sent = await api.sendMessage(event.threadId, {
        video: { stream },
        caption: `${cap}\n\n¤《𝐓𝐎𝐓𝐀𝐋 𝐕𝐈𝐃𝐄𝐎: ${cn}》¤\n\n👉 Reply again to get another video from this category.`,
      }, { quoted: event.message });

      

      
      global.client.handleReply.push({
        name: this.config.name,
        messageID: sent.key.id,
        author: event.senderId,
        type: "video",
        choice
      });

    } catch (err) {
      console.error("Error fetching video:", err.message || err);
      await api.sendMessage(event.threadId, { text: "❌ Failed to fetch video. Try again later." });
    }
  }
};

async function linkanh(choice) {
  const axios = require("axios");
  const apis = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
  const n = apis.data.api;
  const options = {
    "1": "/video/love",
    "2": "/video/cpl",
    "3": "/video/shortvideo",
    "4": "/video/sadvideo",
    "5": "/video/status",
    "6": "/video/shairi",
    "7": "/video/baby",
    "8": "/video/anime",
    "9": "/video/humaiyun",
    "10": "/video/islam",
    "11": "/video/horny",
    "12": "/video/hot",
    "13": "/video/item"
  };
  const h = `${n}${options[choice]}`;
  return { p: axios, h };
}
