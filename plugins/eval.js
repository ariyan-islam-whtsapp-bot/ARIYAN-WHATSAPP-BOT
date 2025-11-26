const axios = require('axios');

async function getJson(url, options = {}) {
  const res = await axios.get(url, options);
  return res.data;
}

module.exports = {
  config: {
    name: 'eval',
    aliases: ['ev'],
    permission: 2,
    prefix: 'both',
    categorie: 'Owner',
    credit: 'Developed by Mohammad Nayan',
    usages: [
      `${global.config.PREFIX}eval <code> - Evaluate JavaScript code.`,
    ],
  },
  start: async ({ event, api, args, message }) => {
    try {

      const code = args.join(' ');
      if (!code) {
        return api.sendMessage(event.threadId, { text: '❗ Provide JavaScript code.' }, { quoted: event.message });
      }

      let result;
      try {
        result = await (async () => {
          return await eval(`(async (getJson, axios, api, event, message) => { ${code} })`)(getJson, axios, api, event, message);
        })();
      } catch (err) {
        result = err.toString();
      }

      // Handle media if result is object with type & url
      if (result && typeof result === 'object') {
        if (result.type === 'video' && result.url) {
          return await api.sendMessage(
            event.threadId,
            { video: { url: result.url }, caption: result.caption || '' },
            { quoted: event.message }
          );
        }
        if (result.type === 'image' && result.url) {
          return await api.sendMessage(
            event.threadId,
            { image: { url: result.url }, caption: result.caption || '' },
            { quoted: event.message }
          );
        }
        
        return await api.sendMessage(
          event.threadId,
          { text: `📤 Output:\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\`` },
          { quoted: event.message }
        );
      }

      
      await api.sendMessage(
        event.threadId,
        { text: `📤 Output:\n\`\`\`\n${String(result)}\n\`\`\`` },
        { quoted: event.message }
      );

    } catch (error) {
      console.error(error);
      await api.sendMessage(event.threadId, { text: '⚠️ Eval error.' }, { quoted: event.message });
    }
  }
};
