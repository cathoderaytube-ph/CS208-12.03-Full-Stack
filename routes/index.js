var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
  try {
    req.db.query('SELECT * FROM todos;', (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).send('Error fetching todos');
      }
      res.render('index', { title: 'My Simple TODO', todos: results });
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

router.post('/create', function (req, res, next) {
    const { task } = req.body;

    if(!task || task.trim() === '') {
      return res.status(400).send('Task cannot be empty')
    }

    try {
      req.db.query('INSERT INTO todos (task) VALUES (?);', [task.trim()], (err, results) => {
        if (err) {
          console.error('Error adding todo:', err);
          return res.status(500).send('Error adding todo');
        }
        console.log('Todo added successfully:', results);
        // Redirect to the home page after adding
        res.redirect('/');
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      res.status(500).send('Error adding todo');
    }
});

/* POST update task (edit description & completion status) */
router.post('/update', function (req, res, next) {
    const { id, task, completed } = req.body;

    if(!task || task.trim() === '') {
      return res.status(400).send('Task cannot be empty')
    }

    // Checkbox sends 'on' when checked, undefined when unchecked
    const isCompleted = completed === 'on' ? 1 : 0;

    try {
      req.db.query('UPDATE todos SET task = ?, completed = ? WHERE id = ?;', [task.trim(), isCompleted, id], (err, results) => {
        if (err) {
          console.error('Error updating todo:', err);
          return res.status(500).send('Error updating todo');
        }
        console.log('Todo updated successfully:', results);
        res.redirect('/');
    });
    }catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).send('Error updating todo:');
    }
});

/* POST delete task */
router.post('/delete', function (req, res, next) {
    const { id } = req.body;

    try {
      req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err, results) => {
        if (err) {
          console.error('Error deleting todo:', err);
          return res.status(500).send('Error deleting todo');
        }
        console.log('Todo deleted successfully:', results);
        // Redirect to the home page after deletion
        res.redirect('/');
    });
    }catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).send('Error updating todo:');
    }
});

module.exports = router;