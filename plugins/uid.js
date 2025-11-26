module.exports = {
    config: {
        name: 'uid',
        aliases: ['id', 'userid'],
        permission: 0,
        prefix: 'both',
        categorie: 'Utilities',
        credit: 'Developed by Mohammad Nayan',
        usages: [
            `${global.config.PREFIX}uid - Get your WhatsApp number.`,
            `${global.config.PREFIX}uid @mention - Get UID of mentioned user.`,
            `${global.config.PREFIX}uid (reply) - Get UID of replied user.`
        ]
    },

    start: async ({ event, api }) => {
        try {
            let targetIds = [];

            
            const mentions = event.message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
          console.log(mentions)
            if (mentions && mentions.length > 0) {
                targetIds = mentions;
            }

            
            else if (event.message.message?.extendedTextMessage?.contextInfo?.participant) {
                targetIds = [event.message.message.extendedTextMessage.contextInfo.participant];
            }

            
            else {
                targetIds = [event.senderId];
            }

            
            let response = targetIds.map((jid, i) => {
                const uid = jid.split('@')[0];
                return `@${uid} 📌 UID: ${uid}`;
            }).join("\n");

            await api.sendMessage(event.threadId, {
                text: response,
                mentions: targetIds
            }, { quoted: event.message });

        } catch (error) {
            console.error("UID Command Error:", error);
            await api.sendMessage(event.threadId, { text: '⚠️ An error occurred while getting UID.' }, { quoted: event.message });
        }
    }
};
