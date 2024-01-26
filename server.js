const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todoDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a Todo schema
const todoSchema = new mongoose.Schema({
  task: String
});

// Create a Todo model
const Todo = mongoose.model('Todo', todoSchema);

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Use body-parser to parse POST request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  Todo.find({}, (err, todos) => {
    if (err) {
      console.error(err);
    } else {
      res.render('index', { todos });
    }
  });
});

app.post('/add', (req, res) => {
  const newTodo = new Todo({
    task: req.body.task
  });

  newTodo.save((err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/');
    }
  });
});

app.post('/delete', (req, res) => {
  const todoId = req.body.checkbox;

  Todo.findByIdAndRemove(todoId, (err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/');
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
