const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Reservation = require("../models/Reservation.model");


//  PUT /reservations  -  Set the status of a reservation based on input of the restaurant
router.route("/:id")
  .get((req, res)=>{
    const { id } = req.params;

    Reservation.findById(id)
      .then((reservation) => res.json(reservation))
      .catch((error) => res.json(error));

  })

  .put( (req, res, next) => {
    const { id } = req.params;
    const {status} = req.body

    Reservation.findByIdAndUpdate(id, { status: status})
    .then((newStatus)=>{res
      .status(200)
      .json(
        {
          data: newStatus,
          message: "Status updated successfully",
          error: null,
          pagination: null
        }
      )
    })
    .catch((error)=>{res
      .status(200)
      .json(
        {
          data: null,
          message: "Something went wrong",
          error: error,
          pagination: null
        }
      )
    });
  });


router.post("/:businessId/new", (req, res)=>{
  const {name, surname, date, hour, people, userId} = req.body
  const {businessId} = req.params

  Reservation.create({name, surname, day, hour, people, userId, businessId})
  .then(newReservation => res
    .status(200)
    .json(
      {
        data: newReservation,
        error: null,
        message: "Reservation created successfully"
      })
    )
  .catch(error=> res
    .status(500)
    .json({
      data: null,
      message : "Something went wrong",
      error: error
    }))
})




//  GET /api/tasks/:taskId  - Retrieves a specific task by id
router.get("/tasks/:taskId", (req, res, next) => {
  const { taskId } = req.params;

  Task.findById(taskId)
    .then((task) => res.json(task))
    .catch((error) => res.json(error));
});

// PUT  /api/tasks/:taskId  - Updates a specific task by id
router.put("/tasks/:taskId", (req, res, next) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Task.findByIdAndUpdate(taskId, req.body, { new: true })
    .then((updatedTask) => res.json(updatedTask))
    .catch((err) => res.json(err));
});

//  DELETE /api/tasks/:taskId  - Deletes a specific task by id
router.delete("/tasks/:taskId", (req, res, next) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Task.findByIdAndRemove(taskId)
    .then(() =>
      res.json({ message: `Task with ${taskId} is removed successfully.` })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
