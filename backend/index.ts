import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { clerkClient, getAuth, requireAuth } from "@clerk/express";
import Chat from "./models/Chat.js";
import UserChats from "./models/UserChats.js";
import * as data from "./util.js";

// Extend Express Request type to include 'auth' property
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId?: string;
        [key: string]: any;
      };
    }
  }
}

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

const connect = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    mongoose.connect(data.default.DB_CONNECTION_STRING)
      .then(() => {
        console.log('Database ready');
        resolve();
      })
      .catch((err) => {
        console.error('Connection error:', err);
        reject(err);
      });
  });
};

app.post("/api/chats", requireAuth(), async (req: Request, res: Response) => {
  const userId = req.auth?.userId;
  const { text, answer } = req.body;

  try {
    const newChat = new Chat({
      userId,
      history: [
        { role: "user", parts: [{ text }] },
        { role: "model", parts: [{ text: answer }] },
      ],
    });

    const savedChat = await newChat.save();
    const userChats = await UserChats.find({ userId });

    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();
      res.status(201).send(savedChat._id);
    } else {
      await UserChats.updateOne(
        { userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );

      res.status(201).send(savedChat._id);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating chat!");
  }
});

app.get("/api/userchats", requireAuth(), async (req: Request, res: Response) => {
  const userId = req.auth?.userId;

  try {
    const userChats = await UserChats.find({ userId });
    res.status(200).send(userChats[0]?.chats || []);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching userchats!");
  }
});

app.get("/api/chats/:id", requireAuth(), async (req: Request, res: Response) => {
  const userId = req.auth?.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    res.status(200).send(chat);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching chat!");
  }
});

app.put("/api/chats/:id", requireAuth(), async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || id === "undefined") {
    res.status(400).json({ error: "Invalid or missing chat ID" });
    return;
  }

  const userId = req.auth?.userId;
  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updatedChat);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding conversation!");
  }
});

app.listen(port, () => {
  connect();
  console.log(`Server running on ${port}`);
});
