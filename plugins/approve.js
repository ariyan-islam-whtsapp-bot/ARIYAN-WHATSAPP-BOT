module.exports = {
  config: {
    name: "approve",
    aliases: ["apprv"],
    permission: 2,
    prefix: true,
    categorie: "Admin",
    credit: "Developed by Mohammad Nayan",
    description: "Manage group approval system.",
    usages: [
      `${global.config.PREFIX}approve status - Show approval system status`,
      `${global.config.PREFIX}approve on/off - Enable or disable approval system`,
      `${global.config.PREFIX}approve list - Show approved groups`,
      `${global.config.PREFIX}approve add <threadId> - Approve a group`,
      `${global.config.PREFIX}approve remove <threadId> - Unapprove a group`,
    ],
  },

  start: async ({ event, api, args }) => {
    const threadId = event.threadId;
    const dataFile = "grpAprv.json";

    let data = (await global.data.get(dataFile)) || { aprvStatus: "off", apprvGrp: [] };

    if (!args[0]) {
      return api.sendMessage(threadId, {
        text: "⚡ Usage:\napprove status | on | off | list | add <tid> | remove <tid>",
      });
    }

    const action = args[0].toLowerCase();

    if (action === "status") {
      return api.sendMessage(threadId, {
        text: `📋 Approval System Status: \`${data.aprvStatus}\`\n✅ Approved Groups: ${data.apprvGrp.length}`,
      });
    }

    if (action === "on" || action === "off") {
      data.aprvStatus = action;
      await global.data.set(dataFile, data);
      return api.sendMessage(threadId, {
        text: `⚡ Approval system has been turned \`${action.toUpperCase()}\`.`,
      });
    }

    if (action === "list") {
      if (!data.apprvGrp.length) return api.sendMessage(threadId, { text: "📋 No approved groups yet." });
      let msg = "✅ Approved Groups:\n\n";
      data.apprvGrp.forEach((id, i) => (msg += `${i + 1}. ${id}\n`));
      return api.sendMessage(threadId, { text: msg });
    }

    if (action === "add") {
      const tid = args[1] || event.threadId;
      if (data.apprvGrp.includes(tid)) {
        return api.sendMessage(threadId, { text: `⚠️ Group already approved:\n${tid}` });
      }

      data.apprvGrp.push(tid);
      await global.data.set(dataFile, data);

      await api.sendMessage(threadId, { text: `✅ Group approved:\n${tid}` });

      
      try {
        await api.sendMessage(tid, {
          text: `✅ This group has been approved by the bot admin. All bot features are now active.`
        });
      } catch (err) {
        console.error("Failed to send approval message in the group:", err.message);
      }
    }

    if (action === "remove") {
      const tid = args[1] || event.threadId;
      if (!data.apprvGrp.includes(tid)) {
        return api.sendMessage(threadId, { text: `⚠️ Group not found in approved list:\n${tid}` });
      }
      data.apprvGrp = data.apprvGrp.filter((g) => g !== tid);
      await global.data.set(dataFile, data);
      return api.sendMessage(threadId, { text: `🗑️ Group removed:\n${tid}` });
    }
  },
};
