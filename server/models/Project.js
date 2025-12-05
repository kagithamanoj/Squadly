import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dueDate: Date
});

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'On Hold'],
        default: 'Active'
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    dueDate: {
        type: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tasks: [taskSchema],
    color: {
        type: String,
        default: 'bg-blue-500'
    }
}, {
    timestamps: true
});

// Auto-calculate progress based on completed tasks
projectSchema.methods.calculateProgress = function () {
    if (this.tasks.length === 0) return 0;
    const completedTasks = this.tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / this.tasks.length) * 100);
};

const Project = mongoose.model('Project', projectSchema);
export default Project;
