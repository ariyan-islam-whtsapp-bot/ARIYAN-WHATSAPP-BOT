const isAdmin = global.isAdmin;

module.exports = {
  config: {
    name: 'kick',
    aliases: ['remove'],
    permission: 3,
    prefix: true,
    categorie: 'Moderation',
    credit: 'Developed by Mohammad Nayan | Modified by EMon-BHai',
    description: 'Kicks a user from the group.',
    usages: [
      `${global.config.PREFIX}kick @username - Mention করে ইউজার রিমুভ করুন।`,
      `${global.config.PREFIX}kick (reply) - রিপ্লাই করা ইউজারকে রিমুভ করুন।`,
      `${global.config.PREFIX}remove @username - Kick-এর Alias।`
    ]
  },

  start: async ({ event, api }) => {
    const { threadId, senderId, mentions, message } = event;

    // Bot + User admin check
    const { isSenderAdmin, isBotAdmin } = await isAdmin(api, threadId, senderId);

    const replyMsg = message.message?.extendedTextMessage?.contextInfo;

    // Bot admin না হলে
    if (!isBotAdmin) {
      await api.sendMessage(threadId, {
        text: "⚠️ প্রথমে আমাকে *Admin* করুন, তারপর আমি কাউকে রিমুভ করতে পারবো।"
      });
      return;
    }

    // Sender admin না হলে
    if (!isSenderAdmin) {
      await api.sendMessage(threadId, {
        text: "❌ এই কমান্ড শুধু *Admin* রাই ব্যবহার করতে পারবে!"
      });
      return;
    }

    // -----------------------------
    // 1️⃣ Reply করা হলে
    // -----------------------------
    if (replyMsg && replyMsg.participant) {
      const target = replyMsg.participant;

      if (target === senderId) {
        return api.sendMessage(threadId, {
          text: "❗ আপনি নিজেকে রিমুভ করতে পারবেন না!"
        });
      }

      await api.groupParticipantsUpdate(threadId, [target], "remove");
      return api.sendMessage(threadId, {
        text: `🚫 @${target.split("@")[0]} গ্রুপ থেকে রিমুভ করা হয়েছে।`,
        mentions: [target]
      });
    }

    // -----------------------------
    // 2️⃣ Mention করা হলে
    // -----------------------------
    if (mentions.length > 0) {
      for (const target of mentions) {
        if (target === senderId) {
          await api.sendMessage(threadId, {
            text: "❗ নিজেকে রিমুভ করা সম্ভব নয়!"
          });
          continue;
        }

        await api.groupParticipantsUpdate(threadId, [target], "remove");
        await api.sendMessage(threadId, {
          text: `🚫 @${target.split("@")[0]} রিমুভ করা হয়েছে।`,
          mentions: [target]
        });
      }
      return;
    }

    // -----------------------------
    // 3️⃣ Mention বা reply কোনটাই না থাকলে
    // -----------------------------
    await api.sendMessage(threadId, {
      text: "⚠️ দয়া করে কারো *Reply* করুন বা *@tag* করুন রিমুভ করার জন্য।"
    });
  }
};