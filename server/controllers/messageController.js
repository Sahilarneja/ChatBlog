const messageModel = require("../model/messageModel");

module.exports.addMessage = async(req, res)=> {
    try {
        const {from, to, message} = req.body;
        const data = await messageModel.create({
            message: {text: message},
            users: [from, to],
            sender: from,
        })
    } catch (error) {
        res.status(500).json({msg: error.message, status: false});
    }
};
module.exports.getAllMessage = async (req, res) => {
    try {
      const { from, to } = req.body;
  
      const messages = await messageModel.find({
        users: { $all: [from, to] }
      }).sort({ updatedAt: 1 });
  
      const projectMessages = messages.map(msg => ({
        fromSelf: msg.sender.toString() === from, 
        message: msg.message.text,
      }));
  
      res.status(200).json({ messages: projectMessages, status: true });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ msg: 'Failed to fetch messages', status: false });
    }
  };