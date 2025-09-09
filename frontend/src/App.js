
import './App.css';
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5001/tasks").then(res => setTasks(res.data)).catch(err => console.log(err));
  }, []);

  const addTask = async () => {
    try {
      if (!title.trim()) return;
      console.log("Adding task:", title);
      const res = await axios.post("http://localhost:5001/tasks", { title });
      console.log("Response from backend:", res.data);
      setTasks([...tasks, res.data]);
      setTitle("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleTask = (id, completed) => {
    axios.put(`http://localhost:5001/tasks/${id}`, { completed: !completed }).then(res => {
      setTasks(tasks.map(task => task._id === id ? res.data : task));
    });
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5001/tasks/${id}`).then(() => {
      setTasks(tasks.filter(task => task._id !== id));
    });
  };



  return (
    <div className="app-container" >
      <h1 className="app-title"> Task Manager</h1>

      <div className = "task-input">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
        />
        <button className="add-btn" onClick={addTask}>Add</button>
      </div>

      <ul className="task-list">
        {tasks.map(task => (
          <li key={task._id} className="task-item">
            <span
              onClick={() => toggleTask(task._id, task.completed)}
              style={{ textDecoration: task.completed ? "line-through" : "none", cursor: "pointer" }}
            >
              {task.title}
            </span>
            <button className="delete-btn" onClick={() => deleteTask(task._id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
