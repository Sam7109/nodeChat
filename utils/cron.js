const cron = require('node-cron');
const { Op } = require('sequelize');
const  GroupMessage = require('../model/groupmessage');
const  ArchivedChats = require('../model/archivedchats'); 
// Schedule the cron job to run daily at midnight (00:00)
cron.schedule('0 * * * *', async () => {
  try {
    // Get current date and subtract 2 days
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Fetch messages older than 2 days from the GroupMessage table
    const messagesToArchive = await GroupMessage.findAll({
      where: {
        createdAt: {
          [Op.lt]: twoDaysAgo, // Messages older than 2 days
        },
      },
    });

    if (messagesToArchive.length > 0) {
      // Archive the fetched messages by copying them to ArchivedChats
      const archivedMessages = messagesToArchive.map(message => ({
        groupId: message.groupId,
        userid: message.userid,
        message: message.message,
        originalMessageId: message.id, // Store the original message ID
      }));

      // Bulk insert archived messages into ArchivedChats
      await ArchivedChats.bulkCreate(archivedMessages);

      // Delete archived messages from GroupMessage table
      await GroupMessage.destroy({
        where: {
          id: {
            [Op.in]: messagesToArchive.map(msg => msg.id),
          },
        },
      });

      console.log(`Archived ${messagesToArchive.length} messages.`);
    } else {
      console.log('No messages to archive.');
    }
  } catch (error) {
    console.error('Error during archiving process:', error);
  }
});

console.log('Cron job for archiving messages is running...');
