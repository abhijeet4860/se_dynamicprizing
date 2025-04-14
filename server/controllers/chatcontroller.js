const Message = require('../models/Chat');
const mongoose = require('mongoose');
const User = require('../models/User');

exports.chat = async (req, res) => { 
    const { sender, receiver, content } = req.body;
    
    try {
        const message = await Message.create({ sender, receiver, content });
        
        // Optionally, you can populate sender and receiver details
        await message.populate('sender receiver').execPopulate();

        res.status(201).json({ success: true, message });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
