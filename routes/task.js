const express = require('express');
const router = express.Router();
const { Employee, Task } = require('../models/model');
const auth = require('../middleware/auth');

//  Task Routes 

// Create a new task
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, assignedTo, dueDate } = req.body;

        if (assignedTo) {
            const employee = await Employee.findById(assignedTo);
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
        }
        const task = new Task({ name, description, assignedTo, dueDate });
        await task.save();
        // update the employee's taskAssigned field
        if (assignedTo) {
            await Employee.findByIdAndUpdate(assignedTo, { taskAssigned: task._id });
        }
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// View all tasks
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'name email');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// View a single task 
router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a task

router.put('/:id', auth, async (req, res) => {
    try {
        const { name, description, status, assignedTo, dueDate } = req.body;
        if (!assignedTo) {
            return res.status(400).json({ message: "assignedTo required" });
        }
        const existEmp = await Employee.findById(assignedTo);
        if (!existEmp) {
            return res.status(404).json({ message: "Employee not found" });
        }
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { name, description, status, assignedTo, dueDate },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        await Employee.findByIdAndUpdate(assignedTo, { taskAssigned: task._id });
        res.status(200).json(task); // Changed to 200 for update
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Delete a task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        if (task.assignedTo) {
            await Employee.findByIdAndUpdate(task.assignedTo, { taskAssigned: null });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;