import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskName, setEditingTaskName] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === '') return;
    try {
      await axios.post('api/tasks', { task: newTask });
      setNewTask('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskName(task.name);
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`api/tasks/${id}`, { name: editingTaskName });
      setEditingTaskId(null);
      setEditingTaskName('');
      fetchTasks();
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const toggleCompleted = async (task) => {
    try {
      await axios.put(`api/tasks/${task.id}`, { completed: !task.completed });
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>To-do listi koostamine</h1>
      <div style={styles.inputGroup}>
        <input
          type="text"
          value={newTask || ''}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Lisa uus tegevus"
          style={styles.input}
        />
        <button onClick={addTask} style={styles.addButton}>
          Lisa
        </button>
      </div>
      <ul style={styles.list}>
        {tasks.length === 0 ? (
          <li>Tegevusi pole veel lisatud!</li>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              style={{
                ...styles.listItem,
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'gray' : 'black',
                opacity: task.completed ? 0.6 : 1,  // Sujuvam "fade" efekt tehtud tegevustele
                transition: 'opacity 0.3s ease',  // Fade transition efekt
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompleted(task)}
                  style={{ marginRight: '10px' }}
                />
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={editingTaskName || ''}
                    onChange={(e) => setEditingTaskName(e.target.value)}
                    style={styles.input}
                  />
                ) : (
                  <span>{task.task}</span>
                )}
              </div>
              <div style={styles.buttonGroup}>
                {editingTaskId === task.id ? (
                  <button onClick={() => saveEdit(task.id)} style={styles.button}>
                    Salvesta
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(task)}
                      style={{ ...styles.button, ...styles.editButton }}
                    >
                      Muuda
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      style={{ ...styles.button, ...styles.deleteButton }}
                    >
                      Kustuta
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    backgroundColor: '#a3e4d7', 
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(31, 30, 30, 0.1)',
    fontFamily: 'Arial, sans-serif'
  },
  inputGroup: {
    display: 'flex',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginRight: '10px'
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: 'white',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  editButton: {
    backgroundColor: '#ff66b2',  // Roosa värv muudatuse nupule
    color: 'white'
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white'
  }
};

export default App;
