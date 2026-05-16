var express = require('express');
var router = express.Router();
var GoalSchema = require('../models/goal');
const DATABASE = process.env.DATABASE;


router.get('/getGoals', async function(req, res, next) {
const db = req.db;
    try {
        if (DATABASE === 'MONGODB') {
            let response = await GoalSchema.find({});
            return res.status(200).json(response);
        }
        if (DATABASE === 'MYSQL') {
            const [response] = await db.query(`
                SELECT 
                    id,
                    name,
                    description,
                    duedate,
                    created_at,
                    updated_at
                FROM goals
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

router.post('/addGoal', async function(req, res, next) {
        const db = req.db;
    if(req.body && req.body.name && req.body.description && req.body.duedate){

        try {

            req.body.duedate = new Date(req.body.duedate);

            // MONGODB
            if (DATABASE === 'MONGODB') {

                let goal = new GoalSchema(req.body);

                let response = await goal.save();

                return res.status(200).json(response);

            }

            // MYSQL
            if (DATABASE === 'MYSQL') {

                const [response] = await db.query(`
                    INSERT INTO goals
                    (
                        name,
                        description,
                        duedate
                    )
                    VALUES (?, ?, ?)
                `, [
                    req.body.name,
                    req.body.description,
                    req.body.duedate
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
            error: "Missing required fields: name, description, duedate"
        });

    }

});

router.delete('/removeGoal/:id', async function(req, res, next) {
        const db = req.db;
    if(req.params && req.params.id){

        let id = req.params.id;

        try {

            // MONGODB
            if (DATABASE === 'MONGODB') {

                await GoalSchema.findByIdAndDelete(id);

                return res.status(200).json({
                    message: "Goal removed successfully"
                });

            }

            // MYSQL
            if (DATABASE === 'MYSQL') {

                await db.query(`
                    DELETE FROM goals
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