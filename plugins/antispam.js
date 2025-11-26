const spamData = {};
const antiSpamStatus = {};
module.exports = {
  config: {
    name: "antispamkick",
    aliases: ["spamkick", "nospamkick", "aspam", "antispam"],
    permission: 3,
    prefix: true,
    description: "Anti-spam with auto-kick, ON/OFF controllable per thread",
    categories: "Moderation",
    usages: [
      `${global.config.PREFIX}antispam on - Enable anti-spam`,
      `${global.config.PREFIX}antispam off - Disable anti-spam`
    ],
    credit: "Developed by Mohammad Nayan"
  },

  start: async ({ api, event, args }) => {
    const { threadId, senderId, message} = event;

    const {isBotAdmin, isSenderAdmin} = await global.isAdmin(api, threadId, senderId);

    if (!isBotAdmin) {
      await api.sendMessage(threadId, { text: `Only admins can use the ${global.config.PREFIX}antispamkick command.` }, { quoted: message });
      return;
    }
    const action = args[0]?.toLowerCase();

    if (action === "on") {
      antiSpamStatus[threadId] = true;
      return api.sendMessage(threadId, { text: "✅ Anti-spam enabled in this thread." }, { quoted: message });
    } else if (action === "off") {
      antiSpamStatus[threadId] = false;
      return api.sendMessage(threadId, { text: "⚠️ Anti-spam disabled in this thread." }, { quoted: message });
    } else {
      return api.sendMessage(threadId, { text: "❌ Usage: `.antispam on` or `.antispam off`" }, { quoted: message });
    }
  },

  event: async ({ event, api }) => {
    const { senderId, threadId } = event;
    if (!antiSpamStatus[threadId]) return;

    const now = Date.now();
    const LIMIT = 5;       
    const INTERVAL = 10000; 

    if (!spamData[senderId]) spamData[senderId] = [];
    spamData[senderId].push(now);
    spamData[senderId] = spamData[senderId].filter(ts => now - ts <= INTERVAL);

    if (spamData[senderId].length > LIMIT) {
      try {
        await api.groupParticipantsUpdate(threadId, [senderId], 'remove');
        await api.sendMessage(threadId, { text: `🚨 @${senderId.split("@")[0]} was removed for spamming!` }, { mentions: [{ id: senderId, tag: senderId.split("@")[0] }] });
        spamData[senderId] = [];
      } catch (err) {
        console.error("Failed to kick user:", err);
        await api.sendMessage(threadId, { text: `⚠️ Failed to kick @${senderId.split("@")[0]}` }, { mentions: [{ id: senderId, tag: senderId.split("@")[0] }] });
      }
    }
  }
};
