module.exports = {
  config: {
    name: 'ping',
    aliases: ['p'],
    permission: 0,
    prefix: 'both',
    categories: 'system',
    description: 'Check bot response time',
    usages: [
      'ping',
      'p'
    ],
    credit: 'Modified by Emon-Bhai'
  },

  start: async ({ event, api }) => {
    const { threadId } = event;

    
    const responses = [
      "🏓 Pong! I'm alive ⚡",
      "⚡ Bot online & responsive!",
      "🚀 Speed check: OK!",
      "✅ System running smoothly!"
    ];

    
    const reply = responses[Math.floor(Math.random() * responses.length)];

    await api.sendMessage(threadId, { text: reply });
  },
};
