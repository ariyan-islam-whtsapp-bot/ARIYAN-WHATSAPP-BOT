const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
  config: {
    name: 'viewOnce',
    aliases: ['view', 'vv'],
    permission: 0,
    prefix: true,
    description: 'Resend quoted media (image, video, gif, audio) directly.',
    categories: 'Tools',
    usages: [`${global.config.PREFIX}vv (reply to media)`],
    credit: 'Developed by Mohammad Nayan'
  },

  start: async ({ event, api }) => {
    const { message } = event;

    try {
      if (!message?.message?.extendedTextMessage?.contextInfo) {
        return api.sendMessage(event.threadId, { text: '⚠️ Please reply to an image, video, gif, or audio.' }, { quoted: message });
      }

      const quotedMessage = message.message.extendedTextMessage.contextInfo.quotedMessage;

      
      let mediaType;
      if (quotedMessage.imageMessage) {
        mediaType = 'image';
      } else if (quotedMessage.videoMessage) {
        mediaType = 'video';
      } else if (quotedMessage.audioMessage) {
        mediaType = 'audio';
      } else if (quotedMessage.gifMessage) {
        mediaType = 'video'; 
      } else {
        return api.sendMessage(event.threadId, { text: '⚠️ Unsupported media type.' }, { quoted: message });
      }

      
      const buffer = await downloadMediaMessage(
        { message: quotedMessage },
        'buffer',
        {},
        {
          logger: undefined,
          reuploadRequest: api.updateMediaMessage
        }
      );

      
      await api.sendMessage(event.threadId, {
        [mediaType]: buffer
      }, { quoted: message });

    } catch (err) {
      console.error('vv command error:', err);
      api.sendMessage(event.threadId, { text: '❌ Failed to resend media.' }, { quoted: event.message });
    }
  }
};
