
module.exports = async function approvalCheck(event) {
  try {
    const dataFile = "grpAprv.json";
    let data = (await global.data.get(dataFile)) || { aprvStatus: "off", apprvGrp: [] };

    
    if (!event.threadId.endsWith("@g.us")) return true;

    
    if (data.aprvStatus === "off") return true;

    
    if (data.aprvStatus === "on") {
      return data.apprvGrp.includes(event.threadId);
    }

    return false;
  } catch (e) {
    console.error("❌ Approval middleware error:", e);
    return true;
  }
};
