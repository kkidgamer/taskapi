const mongoose=require ('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    name: {type:String},
    email:{type: String, unique: true,required: true},
    password: {type: String, required: true},
    dob: {type: Date, default: Date.now},
});

const employeeSchema=new Schema({
    name: {type: String},
    email: {type: String, unique: true, required: true},
    userId: {type: Schema.Types.ObjectId, ref: 'User',default: null},
    salary: {type: Number},
    taskAssigned: {type: Schema.Types.ObjectId, ref: 'Task', default: null},
    hireDate: {type: Date, default: Date.now}
});

const taskSchema=new Schema({
    name: {type: String, required: true},
    description: {type: String},
    status: {type: String, default: 'pending'},
    assignedTo: {type: Schema.Types.ObjectId, ref: 'Employee', default: null},
    dueDate: {type: Date, default: Date.now},
    createdAt:{type: Date, default: Date.now}
});

const User=mongoose.model('User', userSchema);
const Employee=mongoose.model('Employee', employeeSchema);
const Task=mongoose.model('Task', taskSchema);

module.exports={User,Task,Employee}