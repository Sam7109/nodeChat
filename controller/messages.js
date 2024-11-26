const { where } = require("sequelize");
const Messages = require("../model/messages");
const Userdetails = require("../model/userdetails");

exports.sendMessage = async (req, res) => {
  try {
    const userid = req.user.id;
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

// exports.getMessages = async(req,res) => {
//   try{
//     const userid = req.user.id
//     const messages = await Messages.findAll({
//       where: { userid },
//       order: [['createdAt', 'ASC']], // Ensures consistent chronological order
//     }); 
    
//     if(!messages){
//       res.status(201).json({message: 'No data found'})
//     }
//     res.status(200).json({message: 'Data found', messages})
//   }
//   catch(error){
//     res.status(500).json({message: 'Internal server error'})
//   }
// }

exports.getMessagesWithSender = async (req, res) => {
  try {
    const messages = await Messages.findAll({
      include: [
        {
          model: Userdetails,
          attributes: ['username'], // Fetch only the username field
        },
      ],
      order: [['createdAt', 'ASC']], // Sort messages by their timestamp in ascending order
    });

    // Formatting  the response
    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      message: msg.message,
      sender: msg.User.username, // Access the joined username
      timestamp: msg.createdAt,  // Include the timestamp if needed
    }));

    return res.status(200).json(formattedMessages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
