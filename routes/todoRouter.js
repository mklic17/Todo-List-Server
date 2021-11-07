var express = require('express');
const Todo = require("../models/Todo");
const jwt = require('jsonwebtoken');
var router = express.Router();
const privateKey = process.env.PRIVATE_KEY;

// forces the ToDos to be created with Authorized users
router.use(function(req, res, next) {
    console.log(req.header("Authorization"));
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
    
// Gets all of the Users Todos
router.get('/', async function(req, res, next) {
    const toMyDos = await Todo.find().where('createdBy').equals(req.payload.id).exec();
    return res.status(201).json({todo: toMyDos });
});

// router.get('/all', async function(req, res, next) {
//     const allToDos = await Todo.find().exec();
//     return res.status(201).json({todo: allToDos });
// });


router.post("/create", function(req, res, next) {
    if (req.body.title && req.body.description  && req.body.createdDate) {
        const newTodo = new Todo({
            "title": req.body.title,
            "description": req.body.description,
            "createdBy": req.payload.id, // might be beneficial to change to UserId
            "createdDate": req.body.createdDate,
            "completedDate": req.body.completedDate
        });

        newTodo.save().then((savedTodo) => {
            return res.status(201).json({
                id: savedTodo._id
            });
        }).catch((error) => {
			return res.status(500).json({ error: error.message });
        });
    } else {
        res.status(400).json({ error: "Missing info" });
    }
});

module.exports = router;

