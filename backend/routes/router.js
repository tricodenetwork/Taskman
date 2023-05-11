const express = require("express");
const route = express.Router();
const controller = require("../controller/controller");
const multer = require("multer");

// File Storage

const FileStorageEngine = multer.diskStorage({
  filename: (req, file, cb) => {
    file.fieldname == "file" &&
      cb(
        null,
        (req.body.filename = file.originalname
          .split(" ")
          .join("_")
          .split(",")
          .join("_")
          .split("#")
          .join("_"))
      );

    // req.body.filename.pop();
  },
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, "./public/assets/images");
    } else if (file.fieldname === "file") {
      cb(null, "./public/assets/uploads");

      // req.body.filename = file.filename;
      {
      }
    }
  },
  //  console.log(file)
});

const upload = multer({ storage: FileStorageEngine });

//Upload Endpoint
route.post("/get", (req, res) => {
  const UploadObj = {
    size: req.body.size,
  };
  res.send(UploadObj);

  console.log(UploadObj);
});

// User Route
route.post("/user", controller.createUser);
route.get("/user", controller.getUsers);
route.patch("/user", controller.editUser);
// route.delete("/user", controller.delete);

// TAsks Route
route.patch("/task", controller.editTask);
route.put("/job", controller.addTasks);

route.post("/job", controller.createJob);
route.get("/job", controller.getJobs);
route.delete("/job", controller.deleteJob);
route.patch("/job", controller.editJob);
route.patch("/job/tasks", controller.deleteTask);
// route.post("/uploadersong", upload.any(), controller.create);

module.exports = route;
