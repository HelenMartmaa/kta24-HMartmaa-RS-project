const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001;

// Middleware
app.use(express.json());

// SQLite ühendus
const db = new sqlite3.Database('./todos.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Üks lihtne API lõpp-punkt
app.get('/', (req, res) => {
  res.send('To-do App Backend');
});

// Loo lihtne SQLite tabel, kui seda pole veel olemas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0
  )`);
});

app.post('/todos', (req, res) => {
    // Oletame, et keha sisaldab ülesande kirjelduse
    const { task } = req.body; // Saame 'task' väärtuse päringu kehast
    const sql = `INSERT INTO todos (task) VALUES (?)`; // SQL päring, et sisestada ülesanne
    db.run(sql, [task], function (err) {  // Käivitatakse SQL päring
      if (err) {
        // Kui on viga, siis saadame 500 statuskoodiga vea sõnumi
        return res.status(500).send('Error adding task');
      }
      // Kui kõik läks hästi, saadame ülesande ID ja kirjelduse vastuseks
      res.status(201).send({ id: this.lastID, task });
    });
  });
  // GET: kõik ülesanded
  app.get('/todos', (req, res) => {
    db.all('SELECT * FROM todos', [], (err, rows) => {
      if (err) {
        // Kui SQL päringuga tekib viga, siis tagastame vea sõnumi
        return res.status(500).send('Error fetching tasks');
      }
      // Kui päring on edukas, siis tagastame kõik ülesanded JSON-vormingus
      res.json(rows);
    });
  });

  //PUT: Uuenda ülesande staatust
  app.put('/todos/:id', (req, res) => {
    const { id } = req.params;  // Kõigepealt saame ülesande ID URL-ist (nt /todos/1)
    const { completed } = req.body;  // Seejärel saame päringu kehast ülesande lõpetatuse staatuse
    const sql = `UPDATE todos SET completed = ? WHERE id = ?`;  // SQL päring ülesande muutmiseks
    db.run(sql, [completed, id], function (err) {
      if (err) {
        // Kui on viga, siis saadame 500 statuskoodiga vea sõnumi
        return res.status(500).send('Error updating task');
      }
      // Kui kõik läks hästi, saadame uuendatud andmed
      res.send({ id, completed });
    });
  });

  // DELETE: Kustuta ülesanne
  app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;  // Kõigepealt saame ülesande ID URL-ist (nt /todos/1)
    const sql = `DELETE FROM todos WHERE id = ?`;  // SQL päring ülesande kustutamiseks
    db.run(sql, [id], function (err) {
      if (err) {
        // Kui on viga, siis saadame 500 statuskoodiga vea sõnumi
        return res.status(500).send('Error deleting task');
      }
      // Kui kõik läks hästi, siis tagastame 204 vastuse, mis tähendab, et ülesanne on kustutatud
      res.status(204).send();
    });
  });

  
  // Serveri käivitamine
  app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
  });
  