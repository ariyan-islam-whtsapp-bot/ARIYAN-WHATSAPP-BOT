const setAntilinkSetting = global.setAntilinkSetting;
const getAntilinkSetting = global.getAntilinkSetting;

module.exports = {
  config: {
    name: 'antilink',
    aliases: ['al'],
    permission: 2,
    prefix: true,
    categorie: 'Moderation',
    credit: 'Developed by Mohammad Nayan | Modified by Striker Ariyan',
    usages: [
      'antilink off - Disable antilink protection.',
      'antilink whatsapp - Block WhatsApp group links.',
      'antilink whatsappchannel - Block WhatsApp channel links.',
      'antilink telegram - Block Telegram links.',
      'antilink all - Block all types of links.',
    ],
    description: 'Manage and enforce link-blocking policies in your group to prevent spam.'
  },

  // ===========================
  // 🔰 Command Handler
  // ===========================
  start: async ({ event, api, args }) => {
    const { threadId, isSenderAdmin } = event;

    // Sender Admin Check
    if (!isSenderAdmin) {
      await api.sendMessage(threadId, { 
        text: "❌ *শুধুমাত্র Admin রাই antilink সেট করতে পারবেন!*" 
      });
      return;
    }

    const subCommand = args[0]?.toLowerCase();

    // No Sub Command → Show help
    if (!subCommand) {
      const helpText =
`🛡️ *Antilink Protection Commands* (By Striker Ariyan)

1️⃣ *antilink off*
   ➤ Antilink বন্ধ করবে।

2️⃣ *antilink whatsapp*
   ➤ WhatsApp Group লিংক ব্লক।

3️⃣ *antilink whatsappchannel*
   ➤ WhatsApp Channel লিংক ব্লক।

4️⃣ *antilink telegram*
   ➤ Telegram লিংক ব্লক।

5️⃣ *antilink all*
   ➤ সব ধরনের লিংক ব্লক।

— ⚔️ *Striker Ariyan Security System*`;
      
      await api.sendMessage(threadId, { text: helpText });
      return;
    }

    // ===========================
    // 🔰 Apply Sub Commands
    // ===========================
    switch (subCommand) {

      case 'off':
        setAntilinkSetting(threadId, 'off');
        await api.sendMessage(threadId, { 
          text: "🛡️ *Antilink বন্ধ করা হয়েছে! এখন লিংক অনুমোদিত।*\n— Striker Ariyan" 
        });
        break;

      case 'whatsapp':
        setAntilinkSetting(threadId, 'whatsappGroup');
        await api.sendMessage(threadId, { 
          text: "🚫 *WhatsApp Group Link এখন থেকে ব্লক হবে!*\n— Striker Ariyan" 
        });
        break;

      case 'whatsappchannel':
        setAntilinkSetting(threadId, 'whatsappChannel');
        await api.sendMessage(threadId, { 
          text: "🚫 *WhatsApp Channel Link ব্লক Activated!*\n— Striker Ariyan" 
        });
        break;

      case 'telegram':
        setAntilinkSetting(threadId, 'telegram');
        await api.sendMessage(threadId, { 
          text: "🚫 *Telegram Link এখন থেকে বন্ধ!*\n— Striker Ariyan" 
        });
        break;

      case 'all':
        setAntilinkSetting(threadId, 'allLinks');
        await api.sendMessage(threadId, { 
          text: "⚔️ *সব ধরনের লিংক এখন বন্ধ করা হয়েছে! Full Protection ON!* \n— Striker Ariyan" 
        });
        break;

      default:
        await api.sendMessage(threadId, { 
          text: "❗ অকার্যকর কমান্ড! সাহায্যের জন্য *.antilink* লিখুন।" 
        });
    }
  },

  // ===========================
  // 🔰 Auto Delete + Warn System
  // ===========================
  event: async ({ event, api, body }) => {
    const { threadId, senderId, message } = event;
    const antilinkSetting = getAntilinkSetting(threadId);

    // Antilink Off হলে কিছুই হবে না
    if (antilinkSetting === 'off') return;

    // Pattern list
    const linkPatterns = {
      whatsappGroup: /chat\.whatsapp\.com\/[A-Za-z0-9]{20,}/,
      whatsappChannel: /wa\.me\/channel\/[A-Za-z0-9]{20,}/,
      telegram: /t\.me\/[A-Za-z0-9_]+/,
      allLinks: /https?:\/\/[^\s]+/,
    };

    let matched = false;

    if ((antilinkSetting === 'whatsappGroup' && linkPatterns.whatsappGroup.test(body)) ||
        (antilinkSetting === 'whatsappChannel' && linkPatterns.whatsappChannel.test(body)) ||
        (antilinkSetting === 'telegram' && linkPatterns.telegram.test(body)) ||
        (antilinkSetting === 'allLinks' && linkPatterns.allLinks.test(body))) {
      matched = true;
    }

    if (!matched) return;

    try {
      const msgId = message.key.id;
      const sender = message.key.participant || senderId;

      // Delete the message
      await api.sendMessage(threadId, {
        delete: { remoteJid: threadId, fromMe: false, id: msgId, participant: sender }
      });

      // Send Warning
      await api.sendMessage(threadId, {
        text: 
`⚠️ *Warning! Forbidden Link Detected!*  
@${senderId.split("@")[0]}, গ্রুপে লিংক শেয়ার করা *কঠোরভাবে নিষিদ্ধ!*  

🔰 System: *Antilink ACTIVE*  
⚔️ Protection By: *Striker Ariyan Security*`,
        mentions: [senderId]
      });

      console.log(`Deleted link message by ${sender}`);

    } catch (error) {
      console.error("Antilink delete error:", error);
    }
  },
};