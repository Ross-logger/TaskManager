const Task = require('../models/task')
const asyncWrapper = require('../middleware/async')
const path = require("node:path");
const getAllTasks = asyncWrapper(async (req, res) => {
    const tasks = await Task.find({});
    res.status(201).json(tasks);

})
const getTask = asyncWrapper(async (req, res) => {

    const task = await Task.findOne({"_id": req.params.id});
    if (!task) {
        return res.status(404).json({"message": `Task ${req.params.id} not found`})
    }
    res.status(200).json(task);

})

const createTask = asyncWrapper(async (req, res) => {
    const task = await Task.create({"name": req.body.taskName, "completed": req.body.taskStatus !== "inprogress"});
    res.status(201).json(task)

})

const updateTask = asyncWrapper(async (req, res) => {
    const task = await Task.findOneAndUpdate({"_id": req.params.id}, req.body,
        {"new": true, "runValidators": true})
    if (!task) {
        return res.status(404).json({"message": `Task ${req.params.id} not found`})
    }
})

const flagTaskCompleted = asyncWrapper(async (req, res) => {
    const taskId = req.params.id;
    const updatedTask = await Task.findByIdAndUpdate(taskId, {completed: true}, {new: true});
    if (!updatedTask) {
        return res.status(404).json({message: `Task ${taskId} not found`});
    }
    res.json(updatedTask);

})

const deleteTask = asyncWrapper(async (req, res) => {
    const task = await Task.findOneAndDelete({"_id": req.params.id})
    if (!task) {
        return res.status(404).json({"message": `Task ${req.params.id} not found`})
    }
    res.status(201).json({task, "message": "success"})
})


module.exports = {getAllTasks, getTask, createTask, updateTask, deleteTask, flagTaskCompleted};