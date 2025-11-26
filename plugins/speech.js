const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { text2voice } = require("nayan-api-servers");

module.exports = {
  config: {
    name: "speech",
    aliases: ["voice", "say"],
    permission: 0,
    prefix: true,
    categorie: "utility",
    credit: "Developed by Mohammad Nayan",
    description: "Convert text to voice using nayan-api-servers or Google TTS",
    usages: [`${global.config.PREFIX}speech <text>`],
  },

  voices: [
    { name: "Bashkar", gender: "Male" },
    { name: "Pradeep", gender: "Male" },
    { name: "Nabanita", gender: "Female" },
    { name: "Tanisha", gender: "Female" },
    { name: "Google", gender: "English Only" },
  ],

  start: async ({ api, event, args}) => {
    const text = args.join(" ") || event.replyMessage;
    if (!text) {
      return api.sendMessage(event.threadId, {
        text: "❌ Please provide some text.\n👉 Example: /speech Hello world",
      }, { quoted: event.message });
    }

    let msg = "🎙️ Choose a voice for your speech:\n\n";
    module.exports.voices.forEach((v, i) => {
      msg += `${i + 1}. ${v.gender}: ${v.name}\n`;
    });
    msg += `\n👉 Reply with the number to select a voice.`;

    const sent = await api.sendMessage(event.threadId, { text: msg }, { quoted: event.message });

    global.client.handleReply.push({
      name: module.exports.config.name,
      messageID: sent.key?.id || sent.messageID,
      author: event.senderId,
      text,
    });
  },

  handleReply: async ({ api, event, handleReply }) => {
    if (event.senderId !== handleReply.author) return;

    const choice = parseInt(event.body.trim());
    if (isNaN(choice) || choice < 1 || choice > module.exports.voices.length) {
      return api.sendMessage(event.threadId, {
        text: "❌ Invalid choice. Please reply with a valid number.",
      }, { quoted: event.message });
    }

    const selected = module.exports.voices[choice - 1];
    const filePath = path.join(__dirname, `cache/speech_${Date.now()}.mp3`);


    if (selected.name === "Google") {
      try {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
          handleReply.text
        )}&tl=en&client=tw-ob`;

        const response = await axios.get(url, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, response.data);

        await api.sendMessage(event.threadId, {
          audio: {url: filePath},
          mimetype: "audio/mpeg"
        }, { quoted: event.message });

        setTimeout(() => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }, 10000);
      } catch (err) {
        console.error("Google Speech Error:", err);
        await api.sendMessage(event.threadId, {
          text: "❌ Error while generating Google speech: " + err.message,
        }, { quoted: event.message });
      }
      return;
    }


    try {
      const result = await text2voice(handleReply.text, selected.name, filePath);

      if (result.status) {
        await api.sendMessage(event.threadId, {
          audio: {url: result.filePath},
          mimetype: "audio/mpeg"
        }, { quoted: event.message });

        setTimeout(() => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }, 10000);
      } else {
        await api.sendMessage(event.threadId, {
          text: "⚠️ Failed to generate speech. Try again later.",
        }, { quoted: event.message });
      }
    } catch (err) {
      console.error("Speech Command Error:", err);
      await api.sendMessage(event.threadId, {
        text: "❌ Error: " + err.message,
      }, { quoted: event.message });
    }
  },
};
