import React, { useState, useEffect } from 'react';
import { Plus, Folder, Clock, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

interface Task {
    _id: string;
    title: string;
    completed: boolean;
    assignedTo?: {
        _id: string;
        name: string;
        avatar?: string;
    };
    dueDate?: string;
}

interface ProjectUser {
    _id: string;
    name: string;
    avatar?: string;
}

interface Project {
    _id: string;
    name: string;
    description: string;
    status: 'Active' | 'Completed' | 'On Hold';
    progress: number;
    dueDate: string;
    members: ProjectUser[];
    createdBy: ProjectUser;
    tasks: Task[];
    color: string;
}

const COLORS = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500'
];

const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [error, setError] = useState('');

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [color, setColor] = useState(COLORS[0]);

    // Task Form State
    const [taskTitle, setTaskTitle] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/projects');
            setProjects(data);
        } catch (err: any) {
            console.error('Failed to fetch projects:', err);
            setError('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/projects', {
                name,
                description,
                dueDate,
                color
            });
            setProjects([data, ...projects]);
            setIsModalOpen(false);
            resetForm();
        } catch (err: any) {
            console.error('Failed to create project:', err);
            setError(err.response?.data?.message || 'Failed to create project');
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await api.delete(`/projects/${projectId}`);
            setProjects(projects.filter(p => p._id !== projectId));
        } catch (err: any) {
            console.error('Failed to delete project:', err);
            setError(err.response?.data?.message || 'Failed to delete project');
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProject) return;

        try {
            const { data } = await api.post(`/projects/${selectedProject._id}/tasks`, {
                title: taskTitle
            });
            setProjects(projects.map(p => p._id === selectedProject._id ? data : p));
            setTaskTitle('');
            setIsTaskModalOpen(false);
        } catch (err: any) {
            console.error('Failed to add task:', err);
        }
    };

    const handleToggleTask = async (projectId: string, taskId: string, completed: boolean) => {
        try {
            const { data } = await api.put(`/projects/${projectId}/tasks/${taskId}`, {
                completed: !completed
            });
            setProjects(projects.map(p => p._id === projectId ? data : p));
        } catch (err: any) {
            console.error('Failed to update task:', err);
        }
    };

    const handleDeleteTask = async (projectId: string, taskId: string) => {
        try {
            const { data } = await api.delete(`/projects/${projectId}/tasks/${taskId}`);
            setProjects(projects.map(p => p._id === projectId ? data : p));
        } catch (err: any) {
            console.error('Failed to delete task:', err);
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setDueDate('');
        setColor(COLORS[0]);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-blue-100 text-blue-700';
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'On Hold': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Projects</h1>
                    <p className="text-gray-500 mt-1">Manage your team projects and tasks</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 font-bold active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    New Project
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl">
                    {error}
                    <button onClick={() => setError('')} className="float-right font-bold">×</button>
                </div>
            )}

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Folder className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-500 mb-4">Create your first project to get started</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold"
                    >
                        Create Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {projects.map((project) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-apple-hover transition-all duration-300"
                            >
                                <div className={`h-2 ${project.color}`} />
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 ${project.color} rounded-xl flex items-center justify-center`}>
                                                <Folder className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{project.name}</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(project.status)}`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteProject(project._id)}
                                            className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description || 'No description'}</p>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Progress</span>
                                            <span className="font-bold text-gray-900">{project.progress}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${project.progress}%` }}
                                                className={`h-full ${project.color}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Tasks */}
                                    <div className="space-y-2 mb-4">
                                        {project.tasks.slice(0, 3).map((task) => (
                                            <div
                                                key={task._id}
                                                className="flex items-center gap-2 text-sm group/task"
                                            >
                                                <button
                                                    onClick={() => handleToggleTask(project._id, task._id, task.completed)}
                                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${task.completed
                                                        ? 'bg-green-500 border-green-500 text-white'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                >
                                                    {task.completed && <Check className="w-3 h-3" />}
                                                </button>
                                                <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                                    {task.title}
                                                </span>
                                                <button
                                                    onClick={() => handleDeleteTask(project._id, task._id)}
                                                    className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 opacity-0 group-hover/task:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                        {project.tasks.length > 3 && (
                                            <p className="text-xs text-gray-400">+{project.tasks.length - 3} more tasks</p>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Clock className="w-4 h-4" />
                                            {project.dueDate
                                                ? new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                : 'No deadline'
                                            }
                                        </div>
                                        <button
                                            onClick={() => { setSelectedProject(project); setIsTaskModalOpen(true); }}
                                            className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                                        >
                                            Add Task
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Create Project Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
                            </div>
                            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                                        placeholder="Website Redesign"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none resize-none"
                                        placeholder="Project details..."
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                                    <div className="flex gap-2">
                                        {COLORS.map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setColor(c)}
                                                className={`w-8 h-8 rounded-full ${c} ${color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setIsModalOpen(false); resetForm(); }}
                                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold shadow-lg shadow-primary-200"
                                    >
                                        Create Project
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Task Modal */}
            <AnimatePresence>
                {isTaskModalOpen && selectedProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsTaskModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-xl font-bold text-gray-900">Add Task to {selectedProject.name}</h2>
                            </div>
                            <form onSubmit={handleAddTask} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                                    <input
                                        type="text"
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                                        placeholder="Design homepage"
                                        required
                                    />
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setIsTaskModalOpen(false); setTaskTitle(''); }}
                                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold shadow-lg shadow-primary-200"
                                    >
                                        Add Task
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectsPage;
