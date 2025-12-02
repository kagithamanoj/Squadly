import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CheckSquare, FolderOpen, DollarSign, ArrowRight } from 'lucide-react';

const ProjectsOverview: React.FC = () => {
    const quickStats = [
        { label: 'Active Projects', value: '4', icon: Briefcase, color: 'indigo' },
        { label: 'Tasks', value: '15', icon: CheckSquare, color: 'teal' },
        { label: 'Files', value: '28', icon: FolderOpen, color: 'blue' },
        { label: 'Project Budget', value: '$3,200', icon: DollarSign, color: 'green' },
    ];

    const sections = [
        { name: 'Projects', path: '/projects/list', icon: Briefcase, color: 'indigo', description: 'Manage projects' },
        { name: 'Tasks', path: '/projects/tasks', icon: CheckSquare, color: 'teal', description: 'Track progress' },
        { name: 'Files', path: '/projects/files', icon: FolderOpen, color: 'blue', description: 'Share documents' },
        { name: 'Expenses', path: '/projects/expenses', icon: DollarSign, color: 'green', description: 'Track costs' },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                        <p className="text-gray-600">Collaborate on group projects</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {quickStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center mb-4`}>
                                <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Link key={section.path} to={section.path} className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 rounded-xl bg-${section.color}-100 flex items-center justify-center`}>
                                    <Icon className={`w-7 h-7 text-${section.color}-600`} />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{section.name}</h3>
                            <p className="text-gray-600">{section.description}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default ProjectsOverview;
