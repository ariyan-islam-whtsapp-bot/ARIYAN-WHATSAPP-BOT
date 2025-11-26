module.exports = {
  config: {
    name: 'wpcheck',
    aliases: ['checkwp', 'iswp'],
    permission: 0,
    prefix: true,
    description: 'Check if number(s) have WhatsApp accounts.',
    categories: 'Utility',
    usages: ['.wpcheck 8801615298449 8801754168148'],
    credit: 'Developed by Mohammad Nayan'
  },

  start: async ({ api, args, event }) => {
    const { threadId } = event;

    const numbers = args.join(' ').split(/\s+/).filter(Boolean);

    if (!numbers.length) {
      return api.sendMessage(threadId, {
        text: '❌ Please provide one or more phone numbers.\nExample:\n.wpcheck 8801615298449 8801754168148'
      });
    }

    const validNumbers = numbers.filter(num => /^\d{10,15}$/.test(num));
    const invalidNumbers = numbers.filter(num => !/^\d{10,15}$/.test(num));

    const iswp = [], nknwp = [];

    const ckwp = async (number) => {
      try {
        const jid = `${number}@s.whatsapp.net`;
        const [result] = await api.onWhatsApp(jid);
        return result?.exists;
      } catch {
        return false;
      }
    };

    for (const number of validNumbers) {
      const exists = await ckwp(number);
      exists ? iswp.push(number) : nknwp.push(number);
    }

    let resultText = '';

    if (iswp.length)
      resultText += `✅ *WhatsApp Found:*\n${iswp.map(n => `• ${n}`).join('\n')}\n\n`;
    if (nknwp.length)
      resultText += `❌ *Not on WhatsApp:*\n${nknwp.map(n => `• ${n}`).join('\n')}\n\n`;
    if (invalidNumbers.length)
      resultText += `⚠️ *Invalid Numbers Skipped:*\n${invalidNumbers.map(n => `• ${n}`).join('\n')}`;

    api.sendMessage(threadId, { text: resultText.trim() });
  }
};
