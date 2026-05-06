var express = require('express');
var router = express.Router();

let tasks = [
    { id_: 1, name: 'Task 1', description: 'Description for Task 1', duedate: '2024-07-01' },
    { id_: 2, name: 'Task 2', description: 'Description for Task 2', duedate: '2024-07-02' },
    { id_: 3, name: 'Task 3', description: 'Description for Task 3', duedate: '2024-07-03' }
];

router.get('/getTasks', (req, res) => {
    res.status(200).json(tasks);
});

router.post('/addTask', (req, res) => {
const { name, description, duedate } = req.body;
if (name && description && duedate) {
    const newTask = {
        id_: Math.floor(Math.random() * 1000) + 1,
        name,
        description,
        duedate
    };
    tasks.push(newTask);
    res.status(200).json(newTask);
} 
});

router.delete('/removeTask/:id', (req, res) => {
    if (req.params && req.params.id && !isNaN(req.params.id)) {
        const taskId = parseInt(req.params.id);
        tasks = tasks.filter(task => task.id_ !== taskId);
        res.status(200).json({ message: `Task with id ${taskId} deleted` });
    } else {
        res.status(400).json({ error: 'Please provide a valid task id' });
    }
});

module.exports = router;    