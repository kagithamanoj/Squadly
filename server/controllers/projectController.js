import Project from '../models/Project.js';

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { createdBy: req.user._id },
                { members: req.user._id }
            ]
        })
            .populate('createdBy', 'name avatar')
            .populate('members', 'name avatar')
            .populate('tasks.assignedTo', 'name avatar')
            .sort({ createdAt: -1 });

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('createdBy', 'name avatar')
            .populate('members', 'name avatar')
            .populate('tasks.assignedTo', 'name avatar');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
    try {
        const { name, description, status, dueDate, color } = req.body;

        const project = new Project({
            name,
            description,
            status,
            dueDate,
            color,
            createdBy: req.user._id,
            members: [req.user._id]
        });

        await project.save();
        await project.populate('createdBy', 'name avatar');
        await project.populate('members', 'name avatar');

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is the creator or a member
        const isMember = project.members.some(m => m.toString() === req.user._id.toString());
        const isCreator = project.createdBy.toString() === req.user._id.toString();

        if (!isMember && !isCreator) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { name, description, status, dueDate, color, progress } = req.body;

        project.name = name || project.name;
        project.description = description || project.description;
        project.status = status || project.status;
        project.dueDate = dueDate || project.dueDate;
        project.color = color || project.color;
        if (progress !== undefined) project.progress = progress;

        await project.save();
        await project.populate('createdBy', 'name avatar');
        await project.populate('members', 'name avatar');

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Only creator can delete
        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await project.deleteOne();
        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add task to project
// @route   POST /api/projects/:id/tasks
// @access  Private
export const addTask = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const { title, assignedTo, dueDate } = req.body;

        project.tasks.push({
            title,
            assignedTo,
            dueDate,
            completed: false
        });

        // Recalculate progress
        project.progress = project.calculateProgress();

        await project.save();
        await project.populate('createdBy', 'name avatar');
        await project.populate('members', 'name avatar');
        await project.populate('tasks.assignedTo', 'name avatar');

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task in project
// @route   PUT /api/projects/:id/tasks/:taskId
// @access  Private
export const updateTask = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const task = project.tasks.id(req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const { title, completed, assignedTo, dueDate } = req.body;

        if (title !== undefined) task.title = title;
        if (completed !== undefined) task.completed = completed;
        if (assignedTo !== undefined) task.assignedTo = assignedTo;
        if (dueDate !== undefined) task.dueDate = dueDate;

        // Recalculate progress
        project.progress = project.calculateProgress();

        // Auto-update status based on progress
        if (project.progress === 100) {
            project.status = 'Completed';
        } else if (project.status === 'Completed' && project.progress < 100) {
            project.status = 'Active';
        }

        await project.save();
        await project.populate('createdBy', 'name avatar');
        await project.populate('members', 'name avatar');
        await project.populate('tasks.assignedTo', 'name avatar');

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete task from project
// @route   DELETE /api/projects/:id/tasks/:taskId
// @access  Private
export const deleteTask = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.tasks = project.tasks.filter(
            task => task._id.toString() !== req.params.taskId
        );

        // Recalculate progress
        project.progress = project.calculateProgress();

        await project.save();
        await project.populate('createdBy', 'name avatar');
        await project.populate('members', 'name avatar');

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
export const addMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const { userId } = req.body;

        if (project.members.includes(userId)) {
            return res.status(400).json({ message: 'User already a member' });
        }

        project.members.push(userId);
        await project.save();
        await project.populate('createdBy', 'name avatar');
        await project.populate('members', 'name avatar');

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
export const removeMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Only creator can remove members
        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        project.members = project.members.filter(
            member => member.toString() !== req.params.userId
        );

        await project.save();
        await project.populate('createdBy', 'name avatar');
        await project.populate('members', 'name avatar');

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
