const fs = require("fs-extra");
const path = require("path");
const request = require("request");

module.exports = {
  config: {
    name: "random",
    aliases: ["rndm"],
    permission: 0,
    prefix: true,
    categorie: "video",
    credit: "Developed by Mohammad Nayan",
    description: "Fetches a random video or a video based on a query.",
    usages: [
      `${global.config.PREFIX}random - Fetches a random video.`,
      `${global.config.PREFIX}random <query> - Fetches a video based on the provided query.`,
    ],
  },

  start: async ({ event, api, args }) => {
    const msg = args.join(" ");
    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    const getJSON = (url) =>
      new Promise((resolve, reject) => {
        request({ url, json: true }, (err, res, body) => {
          if (err) return reject(err);
          resolve(body);
        });
      });

    try {
      const apiData = await getJSON("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
      const apiBaseURL = apiData.api;

      const fetchAndSend = async (videoData, res) => {
        const { url: videoURL, name, cp } = videoData;
          console.log(videoData)
          let ln;
          if (res){
          ln = res.length
          } else {
          ln = videoData.length
          }
        const fileName = `video_${Date.now()}.mp4`;
        const filePath = path.join(cacheDir, fileName);

        await new Promise((resolve, reject) => {
          request(videoURL)
            .pipe(fs.createWriteStream(filePath))
            .on("finish", resolve)
            .on("error", reject);
        });

        await api.sendMessage(event.threadId, {
          video: { stream: fs.createReadStream(filePath) },
          caption: `${cp}\n\n𝐓𝐨𝐭𝐚𝐥 𝐕𝐢𝐝𝐞𝐨𝐬: [${ln}]\n𝐀𝐝𝐝𝐞𝐝 𝐓𝐡𝐢𝐬 𝐕𝐢𝐝𝐞𝐨 𝐓𝐨 𝐓𝐡𝐞 𝐀𝐩𝐢 𝐁𝐲 [${name}]`,
        });

        fs.unlinkSync(filePath);
      };

      if (!msg) {
        try {
          const res = await getJSON(`${apiBaseURL}/video/mixvideo`);
            
          await fetchAndSend(res.url, res);
        } catch (randomError) {
          console.error("Error fetching random video:", randomError);
          await api.sendMessage(event.threadId, {
            text: "❌ Failed to fetch a random video. Please try again later.",
          });
        }
      } else {
        try {
          const res = await getJSON(`${apiBaseURL}/random?name=${encodeURIComponent(msg)}`);
          await fetchAndSend(res.data);
        } catch (searchError) {
          console.error("Error fetching video based on query:", searchError);
          await api.sendMessage(event.threadId, {
            text: "❌ Failed to fetch a video for your query. Please try again later.",
          });
        }
      }
    } catch (mainError) {
      console.error("Error fetching API base URL or processing request:", mainError);
      await api.sendMessage(event.threadId, {
        text: "❌ An unexpected error occurred. Please try again later.",
      });
    }
  },
};
