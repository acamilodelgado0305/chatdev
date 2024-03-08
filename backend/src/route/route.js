import Message  from "../model/message.js"
import express from "express";


const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { message, room, author, time } = req.body;
        const newMessage = new Message({
          message,
          room,
          author,
          time
        });
        await newMessage.save();
        res.status(201).json({ message: 'Message saved successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}
);

export default router;