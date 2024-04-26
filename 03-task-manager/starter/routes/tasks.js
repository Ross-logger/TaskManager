const express = require('express');

const router = express.Router();

const {getTask, createTask, deleteTask, updateTask} = require('../controllers/tasks')

router.route('/').post(createTask);
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask);


module.exports = router;