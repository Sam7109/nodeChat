const Messages = require("../model/messages");

exports.sendMessage = async (req, res) => {
  try {
    const userid = req.userid;
    const messagePayload = req.body.message
    if (messagePayload.length===0) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }
    const createPayload = await Messages.create({
      userid: userid,
      message: messagePayload,
    });

    res
      .status(201)
      .json({ message: "message sent successfully", createPayload });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
