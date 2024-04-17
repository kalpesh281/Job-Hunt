const express = require("express");
const multer = require("multer");
// const fs = require("fs");
// const { v4: uuidv4 } = require("uuid");
// const { promisify } = require("util");
const path = require('path');
require("dotenv").config()
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "jobhunt2024",
  api_key: "838883683355893",
  api_secret: "K6xic-sGPV3Tre83vpvs02PKaCo"
})


const router = express.Router();



const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.match(/jpg|jpeg|pdf|gif|png/)) {
      cb('Error: File is not supported', false)
      return
    }
    cb(null, true)
  }
}).single('image')

router.post("/resume", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({
        message: "Error in uploading"
      });
    } else {
      console.log(req.file.size)
      console.log("file recieved" + req.file.originalname)

      //console.log(req)
      if (req.file == undefined) {
        res.status(400).json({
          message: 'Error: No File Selected!'
        });
      } else {
        console.log(req.file.path)
        cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
          if (err) {
            res.status(400).json({
              message: 'Error: No File Selected!'
            });
          }
          console.log(result.secure_url);
          console.log("file uploaded")
          res.send({
            message: "File uploaded successfully!",
            url: `${result.secure_url}`
          })
        });
      }
    }
  });
})

router.post("/profile", (req, res) => {


  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({
        message: "Error in uploading"
      });
    } else {
      console.log(req.file.size)
      console.log("file recieved" + req.file.originalname)

      //console.log(req)
      if (req.file == undefined) {
        res.status(400).json({
          message: 'Error: No File Selected!'
        });
      } else {
        console.log(req.file.path)
        cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
          if (err) {
            res.status(400).json({
              message: 'Error: No File Selected!'
            });
          }
          console.log(result.secure_url);
          console.log("file uploaded")
          res.send({
            message: "Image uploaded successfully!",
            url: `${result.secure_url}`
          })
        });
      }
    }
  });

})




module.exports = router;
