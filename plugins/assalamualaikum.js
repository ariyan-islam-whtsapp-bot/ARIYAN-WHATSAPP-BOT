const axios = require("axios");

module.exports = {
  config: {
    name: "salam",
    aliases: ["slm", "assalamualaikum", "আসসালামুয়ালাইকুম", "সালাম", "স্লাম"],
    permission: 0,
    prefix: "both",
    categorie: "Greetings",
    cooldowns: 3,
    credit: "Developed by EMon-BHai",
    usages: [
      `${global.config.PREFIX}salam - Send salam to bot.`,
    ],
    description: "Reply with a random salam message.",
  },

  start: async function ({ api, event, args }) {
    const { threadId, message, senderId } = event;
    const usermsg = args.join(" ");

    // শুধু সালাম দিলে
    if (!usermsg) {
      const greetings = [
        `🤲 আসসালামু আলাইকুম 🌸 আল্লাহর রহমত ও বরকত আপনার উপর বর্ষিত হোক।`,
        `🌺 ওয়া আলাইকুম আসসালাম 💚 আল্লাহ আপনাকে হেফাজত করুন।`,
        `✨ সালাম 🌸 শান্তি আপনার জীবনে নেমে আসুক।`,
        `🕌 আসসালামু আলাইকুম 🤍 আপনার দিন হোক বরকতময়।`,
        `💖 সালাম নিন 🤲 সুস্থ থাকুন, সুন্দর থাকুন।`,
        `🌹 আসসালামু আলাইকুম ☪️ জান্নাতের হাওয়া আপনার ঘরে বইুক।`,
        `🌟 সালাম 🌙 সুখ, শান্তি আর সফলতা আপনাকে ঘিরে থাকুক।`,
        `💫 আসসালামু আলাইকুম 🌸 আল্লাহ আপনার সহায় হোন।`,
        `🌼 সালাম 🤍 হৃদয়ে শান্তি নামুক।`,
        `🕋 আসসালামু আলাইকুম ✨ আপনার জন্য দোয়া রইলো।`
      ];

      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

      const greetingMessage = await api.sendMessage(threadId, {
        text: `@${senderId.split('@')[0]} ${randomGreeting}`,
        mentions: [senderId],
      }, { quoted: message });

      global.client.handleReply.push({
        name: this.config.name,
        author: senderId,
        messageID: greetingMessage.key.id,
        type: "chat"
      });

      return;
    }

    // যদি সালামের সাথে কিছু লিখে
    try {
      const apis = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
      const apiss = apis.data.api;

      const response = await axios.get(
        `${apiss}/sim?type=ask&ask=${encodeURIComponent(usermsg)}`
      );

      const replyText = response.data.data?.msg || "🤲 ওয়া আলাইকুম আসসালাম ❤️";

      const sent = await api.sendMessage(threadId, { text: replyText }, { quoted: message });

      global.client.handleReply.push({
        name: this.config.name,
        author: senderId,
        messageID: sent.key.id,
        type: "chat"
      });

    } catch (err) {
      console.error("❌ Salam command error:", err);
      return api.sendMessage(threadId, { text: "❌ কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন।" }, { quoted: message });
    }
  },

  handleReply: async function ({ api, event, handleReply }) {
    const { threadId, message, body, senderId } = event;

    try {
      const apis = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
      const apiss = apis.data.api;

      const response = await axios.get(
        `${apiss}/sim?type=ask&ask=${encodeURIComponent(body)}`
      );

      const replyText = response.data.data?.msg || "🤲 ওয়া আলাইকুম আসসালাম 🌺";

      const sent = await api.sendMessage(threadId, { text: replyText }, { quoted: message });

      global.client.handleReply.push({
        name: this.config.name,
        author: senderId,
        messageID: sent.key.id,
        type: "chat"
      });

    } catch (err) {
      console.error("❌ Error in salam handleReply:", err);
      return api.sendMessage(threadId, { text: "❌ রিপ্লাই করতে সমস্যা হচ্ছে।" }, { quoted: message });
    }
  }
};
