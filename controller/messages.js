const { where } = require("sequelize");
const { Sequelize } = require('sequelize');

const Messages = require("../model/messages");

const Userdetails = require("../model/userdetails");
const Group = require("../model/groups");

const GroupMember = require("../model/groupmembers");
 const GroupMessage = require("../model/groupmessage");

 exports.sendMessage = async (req, res) => {
  try {
    const userid = req.user.id; // Get the logged-in user's ID
    const { message, groupId } = req.body; // Get the message and optional groupId

    if (message.length === 0) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // If groupId exists, send a group message
    if (groupId) {
      const createGroupMessage = await GroupMessage.create({
        groupId,
        userid,  // The sender's userId
        message,
      });
      return res.status(201).json({ message: "Group message sent successfully", createGroupMessage });
    }

    // Otherwise, send a private message
    const createPrivateMessage = await Messages.create({
      userid: userid,
      message,
    });

    res.status(201).json({ message: "Message sent successfully", createPrivateMessage });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



// 

exports.getGroupMessages = async (req, res) => {
  try {
    const userid = req.user.id;
    const { groupId } = req.query; // Ensure the frontend passes this parameter

    if (!groupId) {
      return res.status(400).json({ message: 'groupId is required' });
    }

    // Check if the user is a member of the specified group
    const userGroup = await GroupMember.findOne({
      where: { userid, groupId },
      include: [
        {
          model: Group,
          as: 'group',
          attributes: ['id', 'name']
        },
      ],
      raw: true,
    });

    if (!userGroup) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    // Fetch messages from this specific group
    const groupMessages = await GroupMessage.findAll({
      where: { groupId },
      include: [
        {
          model: Userdetails,
          as: 'user',
          attributes: ['username', 'email'], // Adjust as per your schema
        },
        {
          model: Group,
          as: 'group',
          attributes: ['id', 'name']
        },
      ],
      order: [['createdAt', 'ASC']],
      raw: true,
    });

    // Format the messages
    const formattedMessages = groupMessages.map((msg) => ({
      id: msg.id,
      message: msg.message,
      sender: msg['user.username'],  // Using the populated user details
      timestamp: msg.createdAt,
      group: {
        id: msg['group.id'],
        name: msg['group.name'],
      }
    }));

    return res.status(200).json({
      messages: formattedMessages
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
