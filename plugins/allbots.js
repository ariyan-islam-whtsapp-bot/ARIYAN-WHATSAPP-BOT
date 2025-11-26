// dont change any line this file

module.exports = {
  config: {
    name: "allbots",
    aliases: ["bots", "mybots", "links"],
    permission: 0,
    prefix: true,
    description: "Send all my bot links and tutorials",
    categories: "Utility",
    usages: [".allbots"],
    credit: "Developed by Mohammad Nayan"
  },

  start: async ({ api, event }) => {
    const { threadId, message } = event;

    const myNumber = "8801615298449";
    const msg = `🌟 *NAYAN BOT COLLECTION* 🌟

📱 *WhatsApp Bot*
Link: https://github.com/MOHAMMAD-NAYAN-07/NAYAN-WHATSAPP-BOT
Tutorial: https://youtu.be/hrO_v3z-Lq8

💬 *Messenger Bot*
Link: https://github.com/MOHAMMAD-NAYAN-07/Nayan-Bot
Tutorial: https://youtu.be/DrQw3j56Llk

🤖 *Telegram Bot*
Link: https://github.com/MOHAMMAD-NAYAN-07/NAYAN-TELEGRAM-BOT
Tutorial: https://youtu.be/FyjUL6MwaXs

🛠️ *Support Channel*
Link: https://chat.whatsapp.com/KuSent8x2rIIl93CD1aKBl?mode=ems_copy_c

📞 *Contact Me*: +${myNumber}`;

    await api.sendMessage(threadId, { text: msg }, { quoted: message });
  }
};
