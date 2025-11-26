const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../config.json");

module.exports = {
  config: {
    name: "admin",
    aliases: ["admins"],
    permission: 0,
    prefix: true,
    description: "Show group admins with name + mention + group link + bot admins. Can also add/remove bot admins.",
    category: "Administration",
    credit: "Developed by Mohammad Nayan",
  },

  start: async ({ api, event, args }) => {
    try {
      const { threadId, message, senderId, isSenderBotadmin } = event;

      
      const saveConfig = () => {
        fs.writeFileSync(configPath, JSON.stringify(global.config, null, 2), "utf8");
      };

      
      if (args[0] === "add") {

        if (!isSenderBotadmin) {
          await api.sendMessage(threadId, { text: `Only admins can use the ${global.config.PREFIX}admin add.` }, { quoted: message });
          return;
        }
        const mentions = event.message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentions.length === 0) {
          return api.sendMessage(threadId, { text: "⚠️ Please mention a user to add as bot admin." }, { quoted: message });
        }

        mentions.forEach(jid => {
          const uid = jid.split("@")[0];
          if (!global.config.admin.includes(uid)) {
            global.config.admin.push(uid);
          }
        });

        saveConfig();

        return api.sendMessage(threadId, {
          text: `✅ Added as bot admin:\n${mentions.map(u => `@${u.split('@')[0]}`).join("\n")}`,
          mentions: mentions
        }, { quoted: message });
      }

      
      if (args[0] === "remove") {
        

    if (!isSenderBotadmin) {
      await api.sendMessage(threadId, { text: `Only admins can use the ${global.config.PREFIX}admin remove.` }, { quoted: message });
      return;
    }
        const mentions = event.message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentions.length === 0) {
          return api.sendMessage(threadId, { text: "⚠️ Please mention a user to remove from bot admin." }, { quoted: message });
        }

        let removed = [];
        mentions.forEach(jid => {
          const uid = jid.split("@")[0];
          if (global.config.admin.includes(uid)) {
            global.config.admin = global.config.admin.filter(a => a !== uid);
            removed.push(uid);
          }
        });

        saveConfig();

        return api.sendMessage(threadId, {
          text: removed.length > 0
            ? `❌ Removed from bot admin:\n${removed.map(u => `@${u.split('@')[0]}`).join("\n")}`
            : "⚠️ Mentioned user(s) are not bot admins.",
          mentions: removed
        }, { quoted: message });
      }

      
      const metadata = await api.groupMetadata(threadId);

      const admins = metadata.participants.filter(
        (p) => p.admin === "admin" || p.admin === "superadmin"
      );

      if (!admins || admins.length === 0) {
        return api.sendMessage(threadId, { text: "⚠️ No admins found in this group." });
      }

      const inviteCode = await api.groupInviteCode(threadId);
      const groupLink = `https://chat.whatsapp.com/${inviteCode}`;

      let text = `👑 *Admin Panel for Bot + Group*\n\n📂 *Group Admins:*\n`;
      let mentions = [];

      admins.forEach((admin, idx) => {
        const uid = admin.id.split("@")[0];
        text += `🔹 ${idx + 1}. @${uid}\n`;
        mentions.push(admin.id);
      });

      text += `\n🤖 *Bot Admins:*\n`;
      if (global.config.admin && global.config.admin.length > 0) {
        global.config.admin.forEach((admin, idx) => {
          const uid = admin.split('@')[0];
          text += `🔹 ${idx + 1}. @${uid}\n`;
          mentions.push(admin);
        });
      } else {
        text += "No bot admins set in config.\n";
      }

      text += `\n🔗 *Group Link:* ${groupLink}`;

      await api.sendMessage(
        threadId,
        {
          text,
          mentions,
        },
        { quoted: message }
      );

    } catch (err) {
      console.error("❌ Error in admin command:", err);
      await api.sendMessage(event.threadId, { text: "❌ Failed to fetch admins." });
    }
  },
};
