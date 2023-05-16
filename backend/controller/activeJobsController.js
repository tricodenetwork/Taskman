let activeJobsDB = require("../model/activatejob");
let jobDB = require("../model/Jobmodel");
let userDB = require("../model/model");

exports.activateJob = (req, res) => {
  let store = req.body;
  if (!store) {
    console.log("no body");
    return res.status(400).send({ message: "Please specify data" });
  }
  //   const id = req.query.id;
  //   !id ? console.log("no id found") : console.log(id);
  const { job, matNo, dept, email, handler, status, tasks } = store;
  const { supervisor } = req.query;

  activeJobsDB
    .insertMany({
      supervisor: supervisor,
      email: email,
      tasks: tasks,
      job: job,
      dept: dept,
      matNo: matNo,
      status: "Pending",
    })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "Task not found" });
      } else {
        const index = 0;
        if (index === -1) {
          res.status(404).send({ message: "Task not found" });
        } else {
          const toSet = `tasks.${index}`;
          console.log(data._id);
          console.log(data);
          activeJobsDB
            .updateOne(
              { matNo: matNo, job: job },
              {
                $set: {
                  [`${toSet}.handler`]: handler,
                  [`${toSet}.status`]: "Pending",
                  [`${toSet}.date`]: new Date(),
                },
              }
            )
            .then((result) => {
              if (result.nModified === 0) {
                res.status(500).send({ message: "Error Activating Job" });
              } else {
                res.send({ message: "Handler Assigned" });
              }
            })
            .catch((err) => {
              res.status(500).send({ message: "Could not assign handler" });
            });
        }
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error Activating Job" });
    });
};
exports.getactiveJobs = (req, res) => {
  let store = req.body;
  if (!store) {
    console.log("no body");
    return res.status(400).send({ message: "Please specify data" });
  }
  const id = req.query.id;
  !id ? console.log("no id found") : console.log(id);
  // const { job, matNo, dept, email, handler, status } = store;
  // const { supervisor } = req.query;

  if (id) {
    activeJobsDB
      .findById(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: "Active Job not found",
          });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error getting ActiveJob",
        });
      });
  } else {
    activeJobsDB
      .find({})
      .then((data) => {
        if (!data) {
          res.status(404).send({ messsage: "No Acivejob found" });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ err, message: "Error finding Activejobs" });
      });
  }
};

exports.deleteActiveJobs = (req, res) => {
  const id = req.query.id;
  activeJobsDB
    .findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "Cannot find or delete Job" });
      } else {
        res.send({
          message: "Active Job deleted Successfully!!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Job with id:" + id,
      });
    });
};
