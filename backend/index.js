require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB Connected")).catch(err => console.log(err));

const taskSchema = new mongoose.Schema({ 
    title: String, 
    completed: { type: Boolean, default: false}
});
const Task = mongoose.model("Task", taskSchema);

app.get("/tasks", async (req, res) => { 
    const tasks = await Task.find(); 
    res.json(tasks);
});

app.post("/tasks", async (req, res) => {
    try {
        console.log("Incoming task:", req.body);
        const newTask = new Task(req.body);
        await newTask.save();
        res.json(newTask);
      } catch (err) {
        console.error("Error saving task:", err);
        res.status(500).json({ error: "Failed to add task" });
      }
});

app.put("/tasks/:id", async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
});

app.delete("/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted"});
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});