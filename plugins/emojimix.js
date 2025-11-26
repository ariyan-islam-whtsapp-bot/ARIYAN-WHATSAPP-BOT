const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const request = require("request");

module.exports = {
  config: {
    name: "emojimix",
    aliases: ["emix"],
    permission: 0,
    prefix: true,
    categories: "image",
    credit: "Developed by Mohammad Nayan",
    description: "Mix two emojis into one image",
    usages: [
      `${global.config.PREFIX}emojimix emoji1 | emoji2`,
    ],
  },

  start: async ({ event, api, args }) => {
    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    const msg = args.join(" ");
    const [emoji1, emoji2] = msg.split("|").map(e => e.trim());

    if (!emoji1 || !emoji2) {
      return await api.sendMessage(event.threadId, {
        text: `❌ Wrong format!\nUse: ${global.config.PREFIX}emojimix emoji1 | emoji2`,
      }, { quoted: event.message });
    }

    try {
      const apiData = await axios.get(
        "https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json"
      );
      const apiBaseURL = apiData.data.api;
      const filePath = path.join(cacheDir, `emix_${Date.now()}.png`);

      const emixURL = `${apiBaseURL}/nayan/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`;

      await new Promise((resolve, reject) => {
        request(emixURL)
          .pipe(fs.createWriteStream(filePath))
          .on("finish", resolve)
          .on("error", reject);
      });

      await api.sendMessage(event.threadId, {
        image: { stream: fs.createReadStream(filePath) },
        caption: `✨ Mixed Emoji: ${emoji1} + ${emoji2}`,
      }, { quoted: event.message });

      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("Emoji mix error:", err.message);
      return await api.sendMessage(event.threadId, {
        text: `❌ Failed to mix ${emoji1} and ${emoji2}. Please try again later.`,
      }, { quoted: event.message });
    }
  },
};
