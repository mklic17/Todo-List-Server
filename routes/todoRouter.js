var express = require('express');
const Todo = require("../models/Todo");
const jwt = require('jsonwebtoken');
var router = express.Router();
const privateKey = process.env.PRIVATE_KEY;


// forces the ToDos actions to be used with Authorized users (logged in)
router.use(function(req, res, next) {
    if (req.header("Authorization")) {
        try {
            req.payload = jwt.verify(req.header("Authorization"), privateKey, { algorithms: ['RS256'] });
        } catch(error) {
            return res.status(401).json({"error": error.message});
        }
    } else {
        return res.status(401).json({"error": "Unauthorized"});
    }
    next();
});

    
// GET: /todo/
// returns all of the Users Todos
// used Async / Await
router.get('/', async function(req, res, next) {
    const myToDos = await Todo.find().where('createdBy').equals(req.payload.id).exec();
    console.log('Found ' + myToDos.length + ' notes');
    return res.status(201).json({todo: myToDos });
});


// GET: /todo/all returns all the Todo notes 
// used Async / Await
router.get('/all', async function(req, res, next) {
    const allToDos = await Todo.find().exec();
    return res.status(201).json({todo: allToDos });
});


// POST: to create Todo (title, description, creatdDate)
// used .then() to resolve promise
router.post('/', function(req, res, next) {
    if (req.body.title && req.body.description) {
        const newTodo = new Todo({
            "title": req.body.title,
            "description": req.body.description,
            "createdBy": req.payload.id, // might be beneficial to change to UserId
            "createdDate": Date.now(),
            "completedDate": undefined
        });

        newTodo.save().then((savedTodo) => {
            return res.status(201).json({
                id: savedTodo._id,
                createdDate: savedTodo.createdDate,
                completedDate: undefined
            });
        }).catch((error) => {
			return res.status(500).json({ error: error.message });
        });
    } else {
        res.status(400).json({ error: "Missing info" });
    }
});

// REVIEW: Update to include createdBy and req.payload.id as part of the filter criteria
// DELETE: /todo/:id
// used .then() to resolve promise
router.delete('/:id', function(req, res, next) {
    Todo.findOneAndDelete({ _id: req.params.id }).then((deletedTodo) => {
        return res.status(201).json({  success: true });
    }).catch((error) => {
        return res.status(500).json({ error: error.message });
    });
})

// REVIEW: Update to include createdBy and req.payload.id as part of the filter criteria
// PATCH: /todo/:id/complete
// used .then() to resolve promise
router.patch('/:id/complete', function(req, res, next) {
    const theDate = Date.now();
    const filter = { _id: req.params.id};
    const update = { completedDate : theDate };
    Todo.findOneAndUpdate(filter, update).then((updatedTodo) => {
        return res.status(201).json({
            success: true,
            completedDate: theDate
        });
    }).catch((error) => {
        return res.status(500).json({ error: error.message });
    });

    
}) 

module.exports = router;