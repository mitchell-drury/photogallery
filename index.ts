require('dotenv').config();
const fs = require('fs');
const find = require('list-files');
const multer  = require('multer');
const storage = multer.diskStorage({
  destination: function (req: Request, file: any, cb: Function) {
    cb(null, './images')
  },
  filename: function (req: Request, file: any, cb: Function) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })
const dev = process.env.NODE_ENV !== 'production';
const path = require('path');
import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "client", "dist")));
app.use(express.static("images"));

if (dev) {
  const webpackDev = require("./dev");
  app.use(webpackDev.comp).use(webpackDev.hot);
}

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.post('/upload', upload.array('file'), (req: any, res: Response) => {
  res.json(req.files);
});

app.get('/images', (req: Request, res: Response) => {
  find(function(result: []) {
      res.json(result);
  }, {
      dir: 'images'
  });
});

app.post('/delete', (req: Request, res: Response) => {
  let path = 'images/' + req.body.filename;
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
