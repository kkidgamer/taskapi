const express = require('express');
const router = express.Router();
const { Employee, Task } = require('../models/model');
const auth = require('../middleware/auth');

//  Employee Routes 

// Create a new employee
router.post('/', auth, async (req, res) => {
    try {
        const { name, email, salary } = req.body;
        const existEmp = await Employee.findOne({ email });
        if (existEmp) {
            return res.status(409).json({ message: "Employee already exists" });
        }
        const employee = new Employee({ ...req.body, userId: req.user.id });
        await employee.save();
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// View all employees
router.get('/', auth, async (req, res) => {
    try {
        const employees = await Employee.find().populate('userId', 'name').populate('taskAssigned', 'name');
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// View a single employee by email
router.get('/:email', auth, async (req, res) => {
    try {
        const employee = await Employee.findOne({ email: req.params.email })
            .populate('userId', 'name')
            .populate('taskAssigned', 'name');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Update Employee
// Update an employee
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, email, salary } = req.body;

        // Validate required fields
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if email is already used by another employee
        const existEmp = await Employee.findOne({ email, _id: { $ne: req.params.id } });
        if (existEmp) {
            return res.status(409).json({ message: "Email already in use by another employee" });
        }

        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            { name, email, salary },
            { new: true }
        ).populate('userId', 'name').populate('taskAssigned', 'name');

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Delete an employee
router.delete('/:id', auth, async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // If employee had an assigned task, update the task to remove the assignment
        if (employee.taskAssigned) {
            await Task.findByIdAndUpdate(employee.taskAssigned, { assignedTo: null });
        }

        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports=router