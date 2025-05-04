import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import mongoose from "mongoose";
import * as data from "./util.js";

const port = process.env.PORT || 3000;
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));

const connect = () => {
    return new Promise((resolve, reject) => {

        mongoose.connect(data.default.DB_CONNECTION_STRING, {});

        const db = mongoose.connection;

        db.on('error', (err) => {
            console.error('connection error:', err);
            reject(err);
        });
        db.once('open', function () {
            console.log('Database ready');
            resolve();
        });
    });
};

// SDK initialization

var imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.listen(port, () => {
  connect();
  console.log("Server running on 3000");
});