import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Home,
    Plane,
    PartyPopper,
    Briefcase,
    Users,
    DollarSign,
    MessageSquare,
    Settings,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';

interface SubItem {
    name: string;
    path: string;
}

interface Scenario {
    name: string;
    icon: any;
    color: string;
    path: string;
    subItems: SubItem[];
}

const Sidebar: React.FC = () => {
    const { pathname } = useLocation();
    const [expandedScenarios, setExpandedScenarios] = useState<string[]>(['Home']);

    const scenarios: Scenario[] = [
        {
            name: 'Home',
            icon: Home,
            color: 'teal',
            path: '/home',
            subItems: [
                { name: 'Overview', path: '/home' },
                { name: 'Chores', path: '/home/chores' },
                { name: 'Shopping', path: '/home/shopping' },
                { name: 'Meals', path: '/home/meals' },
                { name: 'Expenses', path: '/home/expenses' },
            ]
        },
        {
            name: 'Travel',
            icon: Plane,
            color: 'orange',
            path: '/travel',
            subItems: [
                { name: 'Overview', path: '/travel' },
                { name: 'Trips', path: '/travel/trips' },
                { name: 'Itineraries', path: '/travel/itineraries' },
                { name: 'Packing', path: '/travel/packing' },
                { name: 'Expenses', path: '/travel/expenses' },
            ]
        },
        {
            name: 'Events',
            icon: PartyPopper,
            color: 'purple',
            path: '/events',
            subItems: [
                { name: 'Overview', path: '/events' },
                { name: 'Events List', path: '/events/list' },
                { name: 'Guest Lists', path: '/events/guests' },
                { name: 'Tasks', path: '/events/tasks' },
                { name: 'Expenses', path: '/events/expenses' },
            ]
        },
        {
            name: 'Projects',
            icon: Briefcase,
            color: 'indigo',
            path: '/projects',
            subItems: [
                { name: 'Overview', path: '/projects' },
                { name: 'Projects', path: '/projects/list' },
                { name: 'Tasks', path: '/projects/tasks' },
                { name: 'Files', path: '/projects/files' },
                { name: 'Expenses', path: '/projects/expenses' },
            ]
        },
        {
            name: 'Social',
            icon: Users,
            color: 'pink',
            path: '/social',
            subItems: [
                { name: 'Overview', path: '/social' },
                { name: 'Activities', path: '/social/activities' },
                { name: 'Polls', path: '/social/polls' },
                { name: 'Chat', path: '/social/chat' },
                { name: 'Expenses', path: '/social/expenses' },
            ]
        }
    ];

    const toggleScenario = (scenarioName: string) => {
        setExpandedScenarios(prev =>
            prev.includes(scenarioName)
                ? prev.filter(s => s !== scenarioName)
                : [...prev, scenarioName]
        );
    };

    const isScenarioActive = (scenario: Scenario) => {
        return pathname.startsWith(scenario.path);
    };

    const isSubItemActive = (path: string) => {
        return pathname === path;
    };

    return (
        <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-gray-200">
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
                {/* Logo */}
                <div className="flex items-center flex-shrink-0 px-6 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xl">S</span>
                    </div>
                    <span className="ml-3 text-2xl font-bold text-gray-800">Squadly</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-1">
                    {/* Dashboard */}
                    <Link
                        to="/dashboard"
                        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all ${pathname === '/dashboard'
                                ? 'bg-orange-100 text-orange-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <LayoutDashboard
                            className={`mr-3 flex-shrink-0 h-5 w-5 ${pathname === '/dashboard' ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'
                                }`}
                        />
                        Dashboard
                    </Link>

                    {/* Scenarios */}
                    {scenarios.map((scenario) => {
                        const Icon = scenario.icon;
                        const isExpanded = expandedScenarios.includes(scenario.name);
                        const isActive = isScenarioActive(scenario);

                        return (
                            <div key={scenario.name} className="space-y-1">
                                {/* Scenario Header */}
                                <button
                                    onClick={() => toggleScenario(scenario.name)}
                                    className={`w-full group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-xl transition-all ${isActive
                                            ? `bg-${scenario.color}-100 text-${scenario.color}-700`
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <Icon
                                            className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? `text-${scenario.color}-600` : 'text-gray-400 group-hover:text-gray-600'
                                                }`}
                                        />
                                        {scenario.name}
                                    </div>
                                    {isExpanded ? (
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>

                                {/* Sub Items */}
                                {isExpanded && (
                                    <div className="ml-8 space-y-1">
                                        {scenario.subItems.map((subItem) => (
                                            <Link
                                                key={subItem.path}
                                                to={subItem.path}
                                                className={`block px-3 py-2 text-sm rounded-lg transition-colors ${isSubItemActive(subItem.path)
                                                        ? `text-${scenario.color}-700 bg-${scenario.color}-50 font-medium`
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* All Expenses */}
                    <Link
                        to="/expenses"
                        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all ${pathname === '/expenses'
                                ? 'bg-green-100 text-green-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <DollarSign
                            className={`mr-3 flex-shrink-0 h-5 w-5 ${pathname === '/expenses' ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'
                                }`}
                        />
                        All Expenses
                    </Link>

                    {/* Messages */}
                    <Link
                        to="/messages"
                        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all ${pathname === '/messages'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <MessageSquare
                            className={`mr-3 flex-shrink-0 h-5 w-5 ${pathname === '/messages' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'
                                }`}
                        />
                        Messages
                    </Link>

                    {/* Settings */}
                    <Link
                        to="/settings"
                        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all ${pathname === '/settings'
                                ? 'bg-gray-100 text-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <Settings
                            className={`mr-3 flex-shrink-0 h-5 w-5 ${pathname === '/settings' ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'
                                }`}
                        />
                        Settings
                    </Link>
                </nav>

                {/* User Profile */}
                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                            M
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">Manoj</p>
                            <p className="text-xs text-gray-500">View profile</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
