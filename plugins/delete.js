module.exports = {
  config: {
    name: 'delete',
    aliases: ['del', 'uns'],
    permission: 3,
    prefix: 'both',
    categorie: 'Moderation',
    credit: 'Developed by Mohammad Nayan',
    usages: [
      `${global.config.PREFIX}delete - Deletes a message that the user replies to.`,
      `${global.config.PREFIX}del - Alias for the delete command.`,
      `${global.config.PREFIX}uns - Alias for the delete command.`
    ]
  },

  start: async ({ event, api }) => {
    const { threadId, senderId, message } = event;

    try {
      const {isBotAdmin, isSenderAdmin} = await global.isAdmin(api, threadId, senderId);

      if (!isBotAdmin) {
        await api.sendMessage(threadId, { text: '⚠️ I need to be an admin to delete messages.' });
        return;
      }

      if (!isSenderAdmin) {
        await api.sendMessage(threadId, { text: '⚠️ Only admins can use the delete command.' });
        return;
      }

      const quotedMessageId = message.message?.extendedTextMessage?.contextInfo?.stanzaId;
      const quotedParticipant = message.message?.extendedTextMessage?.contextInfo?.participant;

      if (quotedMessageId) {
        await api.sendMessage(threadId, {
          delete: {
            remoteJid: threadId,
            fromMe: false,
            id: quotedMessageId,
            participant: quotedParticipant
          }
        });
      } else {
        await api.sendMessage(threadId, { text: '⚠️ Please reply to a message you want to delete.' });
      }
    } catch (err) {
      console.error('❌ Delete command error:', err);
      await api.sendMessage(threadId, { text: `❌ Error: ${err.message || err}` }, { quoted: message });
    }
  },
  event: async ({ event, api }) => {
      const { threadId, senderId, message } = event;

      try {
        
        const reaction = message?.message.reactionMessage?.text;;
        
        const reactedKey = message?.message?.reactionMessage?.key;

        if (!reaction || reaction !== '❌') return;

        
        const {isBotAdmin, isSenderAdmin} = await global.isAdmin(api, threadId, senderId);

        if (!isBotAdmin) {
          console.log('⚠️ Bot is not admin, cannot delete message.');
          return;
        }

        if (!isSenderAdmin) {
          console.log('⚠️ Reaction delete only works if sender is admin.');
          return;
        }

        
        await api.sendMessage(threadId, {
          delete: {
            remoteJid: threadId,
            fromMe: false,
            id: reactedKey.id,
            participant: reactedKey.participant
          }
        });

        console.log(`✅ Deleted message because admin reacted ❌`);
      } catch (err) {
        console.error('❌ Reaction Delete Error:', err);
      }
    }
};
