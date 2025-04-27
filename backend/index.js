const express = require('express');
const cors = require('cors');  // Importige CORS
const app = express();
const port = 3001;

app.use(cors());  // Kasutame CORS-i

app.use(express.json());

// Ülesannete andmed
let tasks = [];

/*app.get('/', (req, res) => {
  res.send('Töötab! Backend on käivitatud.');
});*/

// Tagasta ülesannete nimekiri
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const { name } = req.body;
    const newTask = {
      id: tasks.length + 1,
      name,
      completed: false, // <-- Uus väli
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.patch('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const task = tasks.find(t => t.id === parseInt(id));
    
    if (!task) {
      return res.status(404).send('Task not found');
    }
  
    task.completed = completed;
    res.json(task);
});
  // DELETE - kustuta ülesanne
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter(task => task.id !== Number(id));
    res.status(204).send();
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// PUT - muuda ülesannet
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
  
    const task = tasks.find(task => task.id === Number(id));
    if (!task) {
      return res.status(404).json({ error: 'Ülesannet ei leitud' });
    }
  
    if (!name) {
      return res.status(400).json({ error: 'Uus nimi on kohustuslik' });
    }
  
    task.name = name;
    res.json(task);
});
  

