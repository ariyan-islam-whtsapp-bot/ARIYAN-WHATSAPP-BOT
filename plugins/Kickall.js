const isAdmin = global.isAdmin;

module.exports = {
  config: {
    name: "kickall",
    aliases: ["removeall"],
    permission: 3,
    prefix: true,
    categorie: "Moderation",
    credit: "Developed by Mohammad Nayan",
    description: "Remove all non-admin members from the group.",
    usages: [`${global.config.PREFIX}kickall - Kick all non-admin users.`],
  },

  start: async ({ api, event }) => {
    const { threadId, senderId } = event;

    const { isSenderAdmin, isBotAdmin, groupMetadata } = await isAdmin(api, threadId, senderId);

    if (!isBotAdmin) {
      return api.sendMessage(threadId, { text: "⚠️ Please make the bot an admin first." });
    }

    

    const allParticipants = groupMetadata.participants.map(p => p.id);
    const adminList = groupMetadata.participants
      .filter(p => p.admin === "admin" || p.admin === "superadmin")
      .map(p => p.id);

    
    const botNumber = await api.decodeJid(api.user.id);
    const toKick = allParticipants.filter(id => !adminList.includes(id) && id !== botNumber);

    if (toKick.length === 0) {
      return api.sendMessage(threadId, { text: "✅ No non-admin members found to remove." });
    }

    await api.sendMessage(threadId, {
      text: `⚠️ Removing ${toKick.length} non-admin members...`,
    });

    
    for (const userId of toKick) {
      try {
        await api.groupParticipantsUpdate(threadId, [userId], "remove");
        await new Promise(r => setTimeout(r, 1500)); // delay 1.5s each
      } catch (err) {
        console.error("Kick error:", err);
      }
    }

    await api.sendMessage(threadId, {
      text: `✅ Successfully removed ${toKick.length} non-admin members.`,
    });
  },
};