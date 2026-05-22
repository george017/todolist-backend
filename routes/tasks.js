var express = require('express');
var router = express.Router();
var TaskSchema = require('../models/task');
const DATABASE = process.env.DATABASE;


router.get('/getTasks', async function(req, res, next) {
const db = req.db;
    try {
        if (DATABASE === 'MONGODB') {
            let response = await TaskSchema.find({});
            return res.status(200).json(response);
        }
        if (DATABASE === 'MYSQL') {
            const [response] = await db.query(`
                SELECT 
                    id,
                    name,
                    description,
                    dueDate,
                    created_at,
                    updated_at
                FROM tasks
            `);

            return res.status(200).json(response);
        }
        return res.status(500).json({
            error: 'Invalid DATABASE env variable'
        });

    } catch (err) {
        res.status(500).json({
            error: err.message || "Error fetching goals"
        });
    }
});

router.post('/addTask', async function(req, res, next) {
        const db = req.db;
    if(req.body && req.body.name && req.body.description && req.body.dueDate){

        try {

            req.body.duedate = new Date(req.body.duedate);

            // MONGODB
            if (DATABASE === 'MONGODB') {

                let task = new TaskSchema(req.body);

                let response = await task.save();

                return res.status(200).json(response);

            }

            // MYSQL
            if (DATABASE === 'MYSQL') {

                const [response] = await db.query(`
                    INSERT INTO tasks
                    (
                        name,
                        description,
                        dueDate
                    )
                    VALUES (?, ?, ?)
                `, [
                    req.body.name,
                    req.body.description,
                    req.body.dueDate
                ]);

                return res.status(200).json({
                    id: response.insertId,
                    ...req.body
                });

            }

            return res.status(500).json({
                error: 'Invalid DATABASE env variable'
            });

        } catch (err) {

            res.status(500).json({
                error: err.message || "Error saving goal"
            });

        }

    } else {

        res.status(400).json({
            error: "Missing required fields: name, description, dueDate"
        });

    }

});

router.delete('/removeTask/:id', async function(req, res, next) {
        const db = req.db;
    if(req.params && req.params.id){

        let id = req.params.id;

        try {

            // MONGODB
            if (DATABASE === 'MONGODB') {

                await TaskSchema.findByIdAndDelete(id);

                return res.status(200).json({
                    message: "Task removed successfully"
                });

            }

            // MYSQL
            if (DATABASE === 'MYSQL') {

                await db.query(`
                    DELETE FROM tasks
                    WHERE id = ?
                `, [id]);

                return res.status(200).json({
                    message: "Goal removed successfully"
                });

            }

            return res.status(500).json({
                error: 'Invalid DATABASE env variable'
            });

        } catch (err) {

            res.status(500).json({
                error: err.message || "Error removing goal"
            });

        }

    } else {

        res.status(400).json({
            error: "Missing required fields: id"
        });

    }

});

module.exports = router;