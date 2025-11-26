// File: showDetails.js
// Author: Mohammad Nayan

module.exports = {
  config: {
    name: "showDetails", 
    aliases: ["details", "msgDetails"], 
    permission: 0,
    prefix: true,
    categorie: 'Utility',
    credit: 'Developed by Mohammad Nayan',
    usages: [
      `${global.config.PREFIX}showDetails - Displays message details for the current event.`,
      `${global.config.PREFIX}details - Alias for showing message details.`,
      `${global.config.PREFIX}msgDetails - Another alias for showing message details.`
    ]
  },

  event: async ({ event, body }) => {
    const { threadId, senderId, reactionMessage } = event;
    const senderName = event.message?.pushName || "Unknown";
    let msg;
    if (reactionMessage) {
      msg = `reactions: ${reactionMessage.text}`;
    } else {
      msg = body || "No message text.";
    }

    const isGroup = threadId.endsWith("@g.us") ? "Group" : "Private";

    
    const colors = {
      reset: "\x1b[0m",
      blue: "\x1b[34m",
      blueBright: "\x1b[94m",
      green: "\x1b[32m",
      white: "\x1b[37m",
    };

    const line = `${colors.green}⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯${colors.reset}`;

    const userDetails =
      `\n${line}\n` +
      `${colors.blueBright}📂 Chat Type: ${colors.white}${isGroup}${colors.reset}\n` +
      `${colors.blue}📌 Sender Name: ${colors.white}${senderName}${colors.reset}\n` +
      `${colors.blue}📌 Sender ID: ${colors.white}${senderId}${colors.reset}\n` +
      `${colors.blue}📌 Thread ID: ${colors.white}${threadId}${colors.reset}\n` +
      `${colors.blue}📌 Message: ${colors.blueBright}${msg}${colors.reset}\n` +
      `${line}\n`;

    console.log(userDetails);
  },
};
