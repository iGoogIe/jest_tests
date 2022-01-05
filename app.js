const express = require('express');
const app = express();
const todoRoutes = require('./routes/todo.routes');
const mongodb = require("./mongodb/mongodb.connect")

mongodb.connect();

// this is the middleware that will be used for all requests
app.use(express.json());

app.use("/todos", todoRoutes);

// must be below app.use("/todos", todoRoutes)
// This is some kinda funky middleware that will be used when post to /todos returns an error
app.use((error, req, res, next) => {
    // console.log(error);
    res.status(500).json({message: error.message})
});

app.get("/", async (req, res) => {
    res.json("Hello World!");
})

module.exports = app;