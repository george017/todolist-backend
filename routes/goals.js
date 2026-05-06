var express = require('express');
var router = express.Router();

let goals = [
    { id_: 1, name: 'Goal 1', description: 'Description for Goal 1', duedate: '2024-07-01' },
    { id_: 2, name: 'Goal 2', description: 'Description for Goal 2', duedate: '2024-07-02' },
    { id_: 3, name: 'Goal 3', description: 'Description for Goal 3', duedate: '2024-07-03' }
];

// Obtener todos los objetivos
router.get('/getGoals', (req, res) => {
    res.status(200).appendjson(goals);
});

// Agregar un nuevo objetivo
router.post('/addGoal', (req, res) => {
    const { name, description, duedate } = req.body;
    if (name && description && duedate) {
    const newGoal = {
        id_: Math.floor(Math.floor(Math.random() * 1000) + 1),
        name,
        description,
        duedate
    };
    goals.push(newGoal);
    res.status(200).json(newGoal);
} else {
    res.status(400).json({ error: 'Please provide all required fields' });
}
});


router.delete('/removeGoal/:id', (req, res) => {
    if (req.params && req.params.id && !isNaN(req.params.id)) {
        const goalId = parseInt(req.params.id);
        goals = goals.filter(goal => goal.id_ !== goalId);
        res.json({ message: `Goal with id ${goalId} deleted` });
    } else {
        res.status(400).json({ error: 'Please provide a valid goal id' });
    }
});

module.exports = router;