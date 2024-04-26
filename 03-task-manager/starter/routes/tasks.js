const express = require('express');

const router = express.Router();

const {getTask, createTask, deleteTask, updateTask, flagTaskCompleted} = require('../controllers/tasks')

router.route('/').post(createTask);
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask);
router.route('/task_completed/:id').patch(flagTaskCompleted);


module.exports = router;