const axios = require("axios");

module.exports = {
    config: {
        name: 'ephoto',
        aliases: ['ep'],
        permission: 0,
        prefix: 'both',
        description: 'Ephoto360 text effect generator',
        categories: 'image',
        usages: [`${global.config.PREFIX}ephoto`],
        credit: 'Developed by Mohammad Nayan'
    },

    urls: [
      "https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html",
      "https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html",
      "https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html",
      "https://en.ephoto360.com/create-glossy-silver-3d-text-effect-online-802.html",
      "https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html",
      "https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html",
      "https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html",
      "https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html",
      "https://en.ephoto360.com/write-text-on-wet-glass-online-589.html",
      "https://en.ephoto360.com/create-online-typography-art-effects-with-multiple-layers-811.html",
      "https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html",
      "https://en.ephoto360.com/beautiful-3d-foil-balloon-effects-for-holidays-and-birthday-803.html",
      "https://en.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html",
      "https://en.ephoto360.com/christmas-and-new-year-glittering-3d-golden-text-effect-794.html",
      "https://en.ephoto360.com/create-a-frozen-christmas-text-effect-online-792.html",
      "https://en.ephoto360.com/create-a-greeting-video-card-for-international-women-s-day-on-march-8-784.html",
      "https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html",
      "https://en.ephoto360.com/create-impressive-neon-glitch-text-effects-online-768.html",
      "https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html",
      "https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html",
      "https://en.ephoto360.com/create-multicolored-signature-attachment-arrow-effect-714.html",
      "https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html",
      "https://en.ephoto360.com/create-a-star-wars-character-mascot-logo-online-707.html",
      "https://en.ephoto360.com/create-glowing-text-effects-online-706.html",
      "https://en.ephoto360.com/create-3d-text-effect-on-the-beach-online-688.html",
      "https://en.ephoto360.com/create-cute-girl-gamer-mascot-logo-online-687.html",
      "https://en.ephoto360.com/3d-underwater-text-effect-online-682.html",
      "https://en.ephoto360.com/free-bear-logo-maker-online-673.html",
      "https://en.ephoto360.com/create-football-team-logo-online-free-671.html",
      "https://en.ephoto360.com/write-text-on-vintage-television-online-670.html",
      "https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html",
      "https://en.ephoto360.com/create-a-realistic-embroidery-text-effect-online-662.html",
      "https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html",
      "https://en.ephoto360.com/create-a-watercolor-text-effect-online-655.html",
      "https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html",
      "https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html",
      "https://en.ephoto360.com/create-realistic-vintage-3d-light-bulb-608.html",
      "https://en.ephoto360.com/create-blackpink-logo-online-free-607.html",
      "https://en.ephoto360.com/create-funny-warning-sign-602.html",
      "https://en.ephoto360.com/create-3d-gradient-text-effect-online-600.html",
      "https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html",
      "https://en.ephoto360.com/create-a-luxury-gold-text-effect-online-594.html",
      "https://en.ephoto360.com/create-multicolored-neon-light-signatures-591.html",
      "https://en.ephoto360.com/write-in-sand-summer-beach-online-576.html",
      "https://en.ephoto360.com/create-logo-team-logo-gaming-assassin-style-574.html#google_vignette",
      "https://en.ephoto360.com/free-gaming-logo-maker-for-fps-game-team-546.html",
      "https://en.ephoto360.com/vibrant-fireworks-text-effect-535.html",
      "https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html",
      "https://en.ephoto360.com/1917-style-text-effect-523.html",
      "https://en.ephoto360.com/making-neon-light-text-effect-with-galaxy-style-521.html",
      "https://en.ephoto360.com/create-blue-neon-logo-online-507.html",
      "https://en.ephoto360.com/metal-mascots-logo-maker-486.html"
    ],

    
    async translateText(text, lang = "en") {
        try {
            const res = await axios.get(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`
            );
            return res.data[0].map(item => item[0]).join(" ");
        } catch (err) {
            console.error("Translate API error:", err.message);
            return text;
        }
    },

    
    async getTranslatedSlug(url){
        let slug = url;
        if(slug.startsWith("https://ephoto360.com/hieu-ung-ve/")) slug=slug.replace("https://ephoto360.com/hieu-ung-ve/","");
        else if(slug.startsWith("https://en.ephoto360.com/")) slug=slug.replace("https://en.ephoto360.com/","");
        else if(slug.startsWith("https://ephoto360.com/")) slug=slug.replace("https://ephoto360.com/","");
        slug=slug.replace(/\.html$/,"").replace(/^viet-chu-/,"").replace(/-/g," ");
        return await this.translateText(slug,"en");
    },


    start: async function ({ api, event }) {

        const {message} = event
        let msg = "📸 Available Ephoto Effects:\n\n";

        for (let i = 0; i < this.urls.length; i++) {
            let translated = await this.getTranslatedSlug(this.urls[i]);
            msg += `${i + 1}. ${translated}\n`;
        }

        msg += `\n👉 Reply with: [number] [your name]\nExample: 1 Nayan`;

        const sent = await api.sendMessage(event.threadId, { text: msg }, { quoted: message });

        global.client.handleReply.push({
            name: this.config.name,
            messageID: sent.key.id || sent.messageID,
            author: event.senderId
        });
    },

    handleReply: async function ({ api, event, handleReply }) {
        if (event.senderId !== handleReply.author) return;
        const { threadId, senderId, message} = event;
          const {messageID} = handleReply;

        const replyText = event.body.trim();
        const parts = replyText.split(" ");

        if (parts.length < 2) {
            return api.sendMessage(event.threadId, { text: "❌ Format ভুল\n👉 Example: 1 Nayan" }, { quoted: message });
        }

        const index = parseInt(parts[0]) - 1;
        const name = parts.slice(1).join(" ");

        if (isNaN(index) || index < 0 || index >= this.urls.length) {
            return api.sendMessage(event.threadId, { text: "❌ Invalid number" }, { quoted: message });
        }

        const effectUrl = this.urls[index];

        const {data} = await axios.get(`https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/refs/heads/main/api.json`)

        try {
            const apiUrl = `${data.api3}/photo360?name=${encodeURIComponent(name)}&url=${encodeURIComponent(effectUrl)}`;
            const res = await axios.get(apiUrl);

            if (handleReply.messageID) {
                await api.sendMessage(threadId, { delete: { remoteJid: threadId, fromMe: false, id: messageID, participant: senderId } });
            }

            if (res.data && res.data.success) {
                await api.sendMessage(event.threadId, {
                    image:  {url: res.data.imageUrl},
                    caption: `✅ Generated for: ${name}`,

                  }, { quoted: message });
            } else {
                await api.sendMessage(event.threadId, { text: "⚠️ Generation failed, try again later." }, { quoted: message });
            }
        } catch (e) {
            await api.sendMessage(event.threadId, { text: "❌ API Error: " + e.message }, { quoted: message });
        }
    }
};
