let userDB = require("../model/model");
let jobDB = require("../model/Jobmodel");
let activeJobsDB = require("../model/activatejob");



// get Fields

exports.getUsers = (req, res) => {
  if (req.query.id) {
    const id = req.query.id;
    userDB
      .findById(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: "Not found user",
          });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error getting user",
        });
      });
  } else {
    userDB
      .find()
      .then((users) => {
        res.send(users);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error Ocurred while retreiving data",
        });
      });
  }
};
exports.getJobs = (req, res) => {
  if (req.query.id) {
    const id = req.query.id;
    jobDB
      .findById(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: "Not found user",
          });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error getting user",
        });
      });
  } else {
    jobDB
      .find()
      .then((jobs) => {
        res.send(jobs);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error Ocurred while retreiving data",
        });
      });
  }
};

// Create new upload

exports.createUser = async (req, res) => {
  // Validate request
  let store = req.body;

  if (!store) {
    res.status(400).send({ message: "No User data" });
    // res.status(200).send(store)
    return;
  }
  // New Uploads
  const UploadObj = {
    name: store.name,
    dept: store.dept,
    phone: store.phone,
    role: store.role,
    email: store.email,
    password: store.password,
  };

  let User = new userDB(UploadObj);

  // res.send(User)
  //Checking Tenary Operators
  User ? console.log("User dey") : console.log("User no dey");

  // save upload in the database
  // console.log(User);
  User.save()
    .then((data) => {
      res.send(data.id);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "error while saving data",
      });
    });
};
exports.createJob = async (req, res) => {
  // Validate request
  let store = req.body;

  if (!store) {
    res.status(400).send({ message: "No User data" });
    // res.status(200).send(store)
    return;
  }
  // New Uploads
  const UploadObj = {
    name: store.name,
    category: store.category,
    no: store.no,
    duration: store.duration,
  };

  let Job = new jobDB(UploadObj);

  // res.send(User)
  //Checking Tenary Operators
  Job
    ? console.log("Job dey")
    : console.log("Job no dey,possible problem with the model");

  // save upload in the database
  // console.log(Job);
  Job.save()
    .then((data) => {
      res.send(data.id);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "error while saving data",
      });
    });
};

// Edit

exports.editUser = (req, res) => {
  let store = req.body;
  if (!store) {
    console.log("no body");
    return res.status(400).send({ message: "Please specify data" });
  }
  const id = req.query.id;
  !id ? console.log("no id found") : console.log(id);
  const { name, dept, phone, role, email, password } = store;
  userDB
    .updateOne(
      { _id: id },
      {
        $set: {
          name: name,
          dept: dept,
          phone: phone,
          role: role,
          email: email,
          password: password,
        },
      }
    )
    .then((data) => {
      if (!data) {
        res.status(404).send({ messsage: "cannot update user" });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error updating user" });
    });
};

exports.editTask = (req, res) => {
  let store = req.body;
  if (!store) {
    return res.status(400).send({ message: "No data from client" });
  }
  const id = req.query.id;
  if (!id) {
    return res.status(400).send({ message: "Please input id" });
  }
  const { name, duration } = store;
  jobDB
    .findOne({ _id: id })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "Task not found" });
      } else {
        const index = data.tasks.findIndex((task) => task.name === name);
        if (index === -1) {
          res.status(404).send({ message: "Task not found" });
        } else {
          const toSet = `tasks.${index}`;
          jobDB
            .updateOne(
              { _id: id },
              { $set: { [`${toSet}`]: { name: name, duration: duration } } }
            )
            .then((result) => {
              if (result.nModified === 0) {
                res.status(500).send({ message: "Error updating task" });
              } else {
                res.send({ message: "Task updated successfully" });
              }
            })
            .catch((err) => {
              res.status(500).send({ message: "Error updating task" });
            });
        }
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error updating task" });
    });
};

exports.editJob = (req, res) => {
  let store = req.body;
  if (!store) {
    console.log("no body");
    return res.status(400).send({ message: "Please specify data" });
  }
  const id = req.query.id;
  !id ? console.log("no id found") : console.log(id);
  const { name, duration, category, no, tasks } = store;
  jobDB
    .updateOne(
      { _id: id },
      {
        $set: {
          name: name,
          duration: duration,
          category: category,
          no: no,
          tasks: tasks,
        },
      }
    )
    .then((data) => {
      if (!data) {
        res.status(404).send({ messsage: "cannot update user" });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error updating user" });
    });
};

exports.addTasks = (req, res) => {
  let store = req.body;
  if (!store) {
    console.log("no body");
    return res.status(400).send({ message: "Please specify data" });
  }
  const id = req.query.id;
  !id ? console.log("no id found") : console.log(id);
  jobDB
    .updateOne({ _id: id }, { $push: { tasks: store } })
    .then((data) => {
      if (!data) {
        res.status(404).send({ messsage: "cannot update user" });
      } else {
        res.send({ data, messages: "Task added successfully" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error updating user" });
    });
};

exports.deleteJob = (req, res) => {
  const id = req.query.id;
  jobDB
    .findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "Cannot find or delete Job" });
      } else {
        res.send({
          message: "Job deleted Successfully!!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Job with id:" + id,
      });
    });
};

exports.deleteTask = (req, res) => {
  const id = req.query.id;

  const name = req.query.name;
  const duration = req.query.duration;
  jobDB
    .updateOne(
      { _id: id },
      { $pull: { tasks: { name: name, duration: duration } } }
    )
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "Cannot find or delete Task" });
      } else {
        res.send({
          message: "Task deleted Successfully!!",
        });
      }
    })

    .catch((err) => {
      res.status(500).send({
        message: "Could not delete user with id:" + id,
      });
    });
};
