const fs = require("fs");
const path = require("path");

function getFolderSize(folderPath) {
  let totalSize = 0;

  function calculateSize(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        calculateSize(filePath);
      } else {
        totalSize += stats.size;
      }
    }
  }

  calculateSize(folderPath);
  return totalSize;
}

function clearCacheFolder() {
  const cachePath = path.join(process.cwd(), "plugins", "cache");

  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath, { recursive: true });
    return 0;
  }

  const files = fs.readdirSync(cachePath);
  for (const file of files) {
    const filePath = path.join(cachePath, file);
    fs.rmSync(filePath, { recursive: true, force: true });
  }

  return files.length;
}

function checkStorageAndClear() {
  const rootPath = process.cwd();
  const totalSize = getFolderSize(rootPath);
  const totalMB = (totalSize / (1024 * 1024)).toFixed(2);

  if (totalSize > 500 * 1024 * 1024) {
    const deleted = clearCacheFolder();
    console.log(`🗑️ Cache auto-cleared! Host storage used: ${totalMB} MB (>500 MB) | Files deleted: ${deleted}`);
  } else {
    console.log(`📦 Host storage used: ${totalMB} MB (under 500 MB)`);
  }
}

// Run on load
checkStorageAndClear();

module.exports = {
  config: {
    name: "clean",
    aliases: ["clearcache", "free"],
    permission: 2,
    prefix: true,
    categorie: "System",
    credit: "Developed by Mohammad Nayan",
    description: "Clear cache folder if host storage exceeds 500MB",
    usages: [`${global.config.PREFIX}clean`],
  },

  start: async ({ api, event }) => {
    const rootPath = process.cwd();
    const totalSize = getFolderSize(rootPath);
    const totalMB = (totalSize / (1024 * 1024)).toFixed(2);

    const deleted = clearCacheFolder();

    await api.sendMessage(event.threadId, {
      text: `🗑️ Cache cleared manually.\n📦 Host storage used: ${totalMB} MB\n🗂️ Files deleted: ${deleted}`,
    }, { quoted: event.message });
  },
};
