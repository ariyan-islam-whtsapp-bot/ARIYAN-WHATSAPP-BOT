module.exports = {
  config: {
    name: 'profilepic',
    aliases: ['pp', 'avatar'],
    permission: 0,
    prefix: 'both',
    description: 'Send the profile picture of the mentioned user or yourself.',
    categories: 'media',
    usages: [`${global.config.PREFIX}profilepic`, `${global.config.PREFIX}profilepic @mention`],
    credit: 'Developed by Mohammad Nayan',
  },

  start: async ({ event, api }) => {
    const { threadId, senderId, mentions, getProfilePictureUrls } = event;
    const ids = Object.keys(mentions).length > 0 ? mentions : [senderId];

    try {
      const urls = await getProfilePictureUrls(ids);
      const validUrls = Object.entries(urls).filter(([id, url]) => url && !url.includes('Error'));
      if (validUrls.length === 0) {
        await api.sendMessage(threadId, { text: 'No profile picture available for the specified user(s).' });
        return;
      }

      for (const [id, url] of validUrls) {
        const caption = mentions.includes(id) 
        ? `Profile picture of @${id.split('@')[0]}` 
        : 'Profile picture of you.';


        await api.sendMessage(threadId, {
          image: { url: url },
          caption: caption,
          mentions: [id]
        });
      }
    } catch (error) {
      console.error('Error fetching profile pictures:', error);
      await api.sendMessage(threadId, { text: 'An error occurred while fetching the profile pictures. Please try again later.' });
    }
  },
};
