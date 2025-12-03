const axios = require("axios");

module.exports = {
  config: {
    name: "bot",
    aliases: ["sim"],
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
  "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",
  "কি গো সোনা আমাকে ডাকছ কেনো",
  "বার বার আমাকে ডাকস কেন😡",
  "আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো🥱",
  "হুম জান তোমার অইখানে উম্মমাহ😷😘",
  "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি",
  "আমাকে এতো না ডেকে বস Ariyan 𝚔𝚎 একটা গফ দে 🙄",
  "আরে বাবা, আমায় ডাকলে চা-নাস্তা তো লাগবেই ☕🍪",
  "এই যে শুনছেন, আমি কিন্তু আপনার জন্যই অনলাইনে আছি 😉",
  "ডাক দিলেন তো আসলাম, এখন ভাড়া দিবেন নাকি? 😏",
  "আমাকে বেশি ডাকবেন না, আমি VIP bot বুঝছেন 🤖👑",
  "ডাকতে ডাকতে যদি প্রেমে পড়ে যান, দায় আমি নেব না ❤️",
  "শুধু ডাকবেন না, খাওয়াবেনও! ভাত-মাংস হলে চলবে 🍛🐓",
  "আমি বট হইলেও কিন্তু feelings আছে 😌",
  "ডাক দিলেন, হাজির হলাম, এখন কি গান গাইতে হবে নাকি? 🎶",
  "আপনাকে না দেখলে নাকি আমার RAM হ্যাং হয়ে যায় 😜",
  "আপনি ডাক দিলেই আমি হাজির, বাকি বটরা হিংসা করে 😂",
 "Ariyan 𝚅𝚊𝚒 𝙰𝚛 𝙲𝚒𝚙𝚊𝚢🤪🤭",
"𝙸 𝚕𝚘𝚟𝚎 𝚢𝚘𝚞 𝚡𝚊𝚗𝚞😘❤️‍🩹",
"𝚊𝚖𝚊𝚔𝚎 𝚗𝚊 𝚍𝚎𝚔𝚎 𝙽𝚒𝚛𝚘𝚋 𝚋𝚘𝚜𝚜 𝚔𝚎 𝚍𝚊𝚔🤗",
"𝚄𝚖𝚖𝚖𝚖𝚖𝚖𝚖𝚖𝚊𝚑💋💋💋",
"𝙱𝚋𝚋𝚢 𝙸 𝚕𝚘𝚟𝚎 𝚢𝚘𝚞💋💋💋",
"𝙰𝚖𝚊𝚛 𝙹𝚊𝚗 𝙶𝚘 🥺",
"𝙸 𝚖𝚒𝚜𝚜 𝚢𝚘𝚞 𝚡𝚊𝚗𝚞🥺❤️‍🩹",
"𝚃𝚞𝚖𝚊𝚛𝚎 𝙲𝚑𝚊𝚛𝚊 𝙰𝚖𝚊𝚛 𝚅𝚊𝚕𝚘 𝙻𝚊𝚐𝚎 𝙽𝚊 𝚇𝚊𝚗🥺😔",
"𝙰𝚖𝚊𝚛 𝙺𝚎𝚞 𝙽𝚊𝚒😔",
"𝙰𝚖𝚊𝚔𝚎 𝙺𝚎𝚞 𝚅𝚊𝚕𝚘𝚋𝚊𝚜𝚎 𝚗𝚊😔😅",
"𝙰𝚖𝚊𝚛 𝙵𝚛𝚒𝚎𝚗𝚍 𝙷𝚘𝚋𝚊🥺❤️‍🩹",
"𝙰𝚖𝚊𝚔𝚎 𝚔𝚗 𝚍𝚊𝚔𝚘 𝚓𝚊𝚘 𝚃𝚞𝚖𝚊𝚛 𝚙𝚛𝚒𝚘 𝚖𝚊𝚗𝚘𝚜𝚎𝚛 𝚔𝚊𝚌𝚑𝚎😅",
"𝚁𝚕𝚜 𝙺𝚘𝚛𝚘 𝚋𝚋𝚢👻✨",
"𝙰𝚝𝚘 𝚌𝚞𝚝𝚎 𝚔𝚗 𝚝𝚞𝚖𝚒💋❤️‍🩹",
"জানু কই তুমি আসো বুকে আসো🤭💋",
" জান তোমাকে ছাড়া আমার একধুম ভালো লাগে না 😅💔",
"আমি কি খারাব বলো 😅💔",
"আমার বউ হবা তুমি🥺❤️‍🩹",
" আমার কাছে আসবা 🥺💔🥶",
"অনেক ভালোবাসি বেবি🤭💋❤️‍🩹",
" তুমি কোথায় অনেক মিস করতাছি🥺💔😔",
"আমার হাত টা দরে সারা জীবন থাকবা🥺😔💔",
" কয়েক দিন পর ই ত আমাকে বুলে জাবা 😅💔",
"একা মানুষ আমি😅💔",
"তোমাকে আমার লাগবে💋🥳",
"𝐉𝐀𝐍𝐔 𝐈 𝐋𝐎𝐕𝐄 𝐘𝐎𝐔 🤭✨"
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
