const db = require("../models");
const { body, validationResult } = require('express-validator');
const Task = db.tasks;
const Op = db.Sequelize.Op;

// Custom validation function to check if a value is a string
const isString = value => typeof value === 'string';

// Create and Save a new task
exports.create = [
  // Validate request using express-validator
  body('title').notEmpty().withMessage('Title cannot be empty!').custom(isString),
  body('description').notEmpty().withMessage('Description cannot be empty!').custom(isString),
  body('status').isIn(['To Do', 'In Progress', 'Done']).withMessage('Invalid status value!').custom(isString),
  body('due_date').isISO8601().withMessage('Invalid due date format!').custom(isString),

  // Handling validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },

  // Continue with creating the task if validation passed
  (req, res) => {
    // Create a task
    const task = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      due_date: req.body.due_date
    };

    // Save Task in the database
    Task.create(task)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Task."
        });
      });
  }
];

// Retrieve all Tasks from the database.
exports.findAll = (req, res) => {
  Task.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tasks."
      });
    });
};


// Find a single Task with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Task.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Task with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Task with id=" + id
      });
    });
};

// Update a Task by the id in the request
exports.update = [
  // Validate request using express-validator
  body('title').optional().notEmpty().withMessage('Title cannot be empty!').custom(isString),
  body('description').optional().notEmpty().withMessage('Description cannot be empty!').custom(isString),
  body('status').optional().isIn(['To Do', 'In Progress', 'Done']).withMessage('Invalid status value!').custom(isString),
  body('due_date').optional().isISO8601().withMessage('Invalid due date format!').custom(isString),

  // Handling validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },

  // Continue with updating the task if validation passed
  (req, res) => {
    const id = req.params.id;

    Task.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Task was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Task with id=${id}. Maybe Task was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Task with id=" + id
        });
      });
  }
];

// Delete a Task with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Task.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Task was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Task with id=${id}. Maybe Task was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Task with id=" + id
      });
    });
};

// Delete all Task from the database.
exports.deleteAll = (req, res) => {
  Task.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Tasks were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Tasks."
      });
    });
};

// find all published Task
exports.findAllPublished = (req, res) => {
  Task.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Tasks."
      });
    });
};

