const express = require('express');
const app = express();
const tasks = require('./routes/tasks');
const connectDB = require('./db/connect');
const notFound = require('./middleware/notFound');
const errorHandlerMiddleware = require('./middleware/errorHandler');
const path = require('path');
const Task = require('./models/task');
const {readFileSync} = require("node:fs");

require('dotenv').config();


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/v1/tasks', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/v1/tasks/all_tasks', async (req, res) => {
    const tasks = await Task.find({});
    res.json(tasks);
})

// Handle requests for the '/api/v1/tasks' endpoint using the tasks router
app.use('/api/v1/tasks', tasks);

// Catch 404 errors and forward to error handler
app.use(notFound);

// Error handling middleware
app.use(errorHandlerMiddleware);

const port = 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Server is listening on port ${port}`));
    } catch (err) {
        console.error(err.message);
    }
};

start();
