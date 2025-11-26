const axios = require("axios");

module.exports = {
  config: {
    name: "baby",
    aliases: ["babu", "bby", "bbs", "jan"],
    permission: 0,
    prefix: "both",
    categorie: "AI Chat",
    cooldowns: 5,
    credit: "Developed by Mohammad Nayan",
    usages: [
      `${global.config.PREFIX}bot <message> - Start a chat with the bot.`,
      `${global.config.PREFIX}bot - Receive a random greeting from the bot.`,
    ],
    description: "Engage in conversations with an AI-powered bot!",
  },

  start: async function ({ api, event, args }) {
    const { threadId, message, senderId } = event;
    const usermsg = args.join(" ");

    
    if (!usermsg) {
      const greetings = [
  "🌸 জান, তুমি আমার পৃথিবী 💖",
      "🥰 বাবু, তুমি ছাড়া কিছু ভালো লাগে না 💕",
      "💞 বেবি, তুমি আমার সবকিছু 🌹",
      "😍 বউ, তুমি আমার হাসির কারণ 🌺",
      "✨ জান, তুমি আমার ড্রিম গার্ল 🌠",
      "💌 বাবু, তোমার জন্য হৃদয় ভরে যায় 🌸",
      "🌷 বেবি, তুমি আমার টেডি বিয়ার 🧸",
      "🌼 বউ, তুমি আমার গোলাপ ফুল 🌹",
      "❤️ জান, তুমি আমার সুখের কারণ 💕",
      "💎 বাবু, তুমি আমার প্রিয় হীরা 🌟",
      "😘 বেবি, তোমার কথা মনে পড়লেই হাসি পাই 😊",
      "🌙 বউ, তুমি আমার রাতের তারা ⭐",
      "💓 জান, তুমি আমার হৃদয়ের কুইন 👑",
      "💖 বাবু, তুমি আমার ছোট্ট রাজকুমারী 👸",
      "🌺 বেবি, তুমি আমার মিষ্টি ক্যান্ডি 🍬",
      "🥀 বউ, তুমি আমার চিরকালের ভালোবাসা 💌",
      "✨ জান, তুমি আমার সকাল-সন্ধ্যার আলো 🌅",
      "🌹 বাবু, তুমি আমার হৃদয়ের স্পন্দন 💓",
      "💘 বেবি, তুমি আমার এঞ্জেল 👼",
      "🌸 বউ, তুমি আমার ড্রিম 🌠",
      "💖 জান, তুমি ছাড়া আমি কিছুই না 🥰",
      "🌷 বাবু, তুমি আমার সবথেকে কিউট 💕",
      "💓 বেবি, তোমার জন্য বুক ধড়ফড় করে 💖",
      "🌺 বউ, তুমি আমার রাজকন্যা 👸",
      "✨ জান, তোমার জন্য দিন শুরু হয় 🌞",
      "💍 বাবু, তুমি আমার জীবনসঙ্গী 💕",
      "💘 বেবি, তুমি আমার first & last crush 😘",
      "🌼 বউ, তুমি আমার সপ্নের রানী 👑",
      "🌹 জান, তুমি আমার ভালোবাসা 💞",
      "🥰 বাবু, তোমার সাথে কথা না বললে মন খারাপ হয় 😔",
      "😍 বেবি, তুমি আমার হাসির কারণ 🌸",
      "💖 বউ, তুমি আমার হৃদয়ের ধন 💎",
      "🌺 জান, তুমি আমার শ্বাস-প্রশ্বাস 💕",
      "🌷 বাবু, তুমি আমার ছোট্ট পাখি 🕊️",
      "💓 বেবি, তুমি আমার fairy tale princess 👸",
      "✨ বউ, তুমি আমার লাকি চার্ম 🍀",
      "💘 জান, তুমি আমার soulmate 💖",
      "🌼 বাবু, তুমি আমার golden memory 🌟",
      "🥀 বেবি, তুমি আমার সবচেয়ে বড় উপহার 🎁",
      "🌸 বউ, তুমি আমার মনের রাজকন্যা 👑",
      "❤️ জান, তুমি আমার প্রথম ভালোবাসা 💕",
      "🌹 বাবু, তুমি আমার sweet dream 🌠",
      "💖 বেবি, তুমি আমার happy place 🏡",
      "🌷 বউ, তুমি আমার forever partner 💞",
      "💓 জান, তুমি আমার চোখের মণি 👀",
      "🌼 বাবু, তুমি আমার হৃদয়ের মুকুট 👑",
      "✨ বেবি, তুমি আমার endless ভালোবাসা 💕",
      "💘 বউ, তুমি আমার একমাত্র রানি 👸",
      "🌺 জান, তুমি আমার জীবন 💖",
      "💖 বাবু, তুমি আমার সব স্বপ্নের রানী 🌠"
];

      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

      const greetingMessage = await api.sendMessage(threadId, {
        text: `@${senderId.split('@')[0]}, ${randomGreeting}`,
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

    
    try {
      const apis = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
      const apiss = apis.data.api;

      const response = await axios.get(
        `${apiss}/sim?type=ask&ask=${encodeURIComponent(usermsg)}`
      );

      const replyText = response.data.data?.msg || "🤖 I'm not sure how to respond to that.";

      const sent = await api.sendMessage(threadId, { text: replyText }, { quoted: message });

      global.client.handleReply.push({
        name: this.config.name,
        author: senderId,
        messageID: sent.key.id,
        type: "chat"
      });

    } catch (err) {
      console.error("❌ Bot command error:", err);
      return api.sendMessage(threadId, { text: "❌ Something went wrong while talking with bot." }, { quoted: message });
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

      const replyText = response.data.data?.msg || "🤖 I'm not sure how to respond to that.";

      const sent = await api.sendMessage(threadId, { text: replyText }, { quoted: message });

      global.client.handleReply.push({
        name: this.config.name,
        author: senderId,
        messageID: sent.key.id,
        type: "chat"
      });

    } catch (err) {
      console.error("❌ Error in bot handleReply:", err);
      return api.sendMessage(threadId, { text: "❌ Failed to continue conversation." }, { quoted: message });
    }
  }
};
