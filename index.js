require("dotenv").config();
const fs = require('fs');
const find = require('list-files');
const multer  = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })
const dev = process.env.NODE_ENV !== "production";
const path = require("path");
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "client", "dist")));
app.use(express.static("images"));

if (dev) {
  const webpackDev = require("./dev");
  app.use(webpackDev.comp).use(webpackDev.hot);
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.post('/upload', upload.array('file'), (req, res) => {
  res.json(req.files);
});

app.get('/images', (req, res) => {
  find(function(result) {
      res.json(result);
  }, {
      dir: 'images'
  });
});

app.post('/delete', (req, res) => {
  let path = 'images/' + req.body.filename.img;
  try {
    fs.unlinkSync(path);
  } catch(e) {
    res.json(e);
  }
  res.status(200).send();
})

app.listen(3000, function () {
  console.log("Server started on :3000");
});
