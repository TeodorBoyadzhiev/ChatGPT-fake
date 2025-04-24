import express from "express";
import ImageKit from "imagekit";
import cors from "cors";

const port = process.env.PORT || 3000;
const app = express();

// SDK initialization


// var imagekit = new ImageKit({
//     urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
//     publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
//     privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
// });

var imagekit = new ImageKit({
    urlEndpoint: "https://ik.imagekit.io/6rb8jp8qk",
    publicKey: "public_XSUsNJsUTLJBoLpFdpAqq1GPOvA=",
    privateKey: "private_0AR7oV/9l6gyhYQMX5tg4b9jujs="
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.listen(port, () => {
//   connect();
  console.log("Server running on 3000");
});