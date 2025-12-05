import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
    LayoutDashboard,
    Plane,
    LogOut,
    CheckSquare,
    Calendar,
    Users,
    Search
} from 'lucide-react';
import MobileNav from './MobileNav';
import UserSearchModal from '../social/UserSearchModal';

const Sidebar = () => {
    const { pathname } = useLocation();
    const { user, logout } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const navItems = [
        { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
        { path: '/travel', label: 'Travel', icon: Plane },
        { path: '/events', label: 'Events', icon: Calendar },
        { path: '/projects', label: 'Projects', icon: CheckSquare },
        { path: '/social', label: 'Social', icon: Users },
    ];

    return (
        <>
            {/* Sidebar glass effect, persistent on left on desktop */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col z-50
                bg-white/60 border-r border-gray-200 shadow-xl backdrop-blur-2xl
                dark:bg-neutral-900/80 dark:border-neutral-900">
                <div className="flex flex-col flex-grow pt-8 pb-6 px-4 overflow-y-auto">
                    {/* Logo & Brand */}
                    <div className="flex items-center px-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-indigo-300/40">
                            <span className="text-white font-extrabold text-2xl drop-shadow">S</span>
                        </div>
                        <span className="ml-3 text-3xl font-bold text-gray-900 dark:text-white tracking-tight drop-shadow">Squadly</span>
                    </div>

                    {/* Search Button */}
                    <div className="px-2 mb-6">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-primary-600 rounded-xl transition-all border border-gray-100 hover:border-primary-100 group"
                        >
                            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Find Friends...</span>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 relative">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={clsx(
                                        "relative group flex items-center px-4 py-3 text-base font-semibold rounded-2xl transition-all duration-200",
                                        isActive
                                            ? "text-indigo-700 bg-white bg-opacity-80 shadow-lg"
                                            : "text-gray-600 hover:bg-white/70 hover:shadow-sm dark:text-gray-300"
                                    )}
                                    style={{ overflow: 'visible' }}
                                >
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 left-0 bg-gradient-to-tr from-indigo-200/60 to-purple-100/50 shadow-xl rounded-2xl z-0"
                                                initial={{ opacity: 0.2, scale: 1 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            />
                                        )}
                                    </AnimatePresence>
                                    <span className={clsx(
                                        "relative z-10 flex items-center gap-2 transition-colors duration-200",
                                        isActive ? "text-indigo-700" : "text-gray-500 group-hover:text-indigo-900"
                                    )}>
                                        <Icon className={clsx(
                                            "mr-2 flex-shrink-0 h-6 w-6 transition-colors duration-200",
                                            isActive ? "text-indigo-600 drop-shadow" : "text-gray-400 group-hover:text-indigo-600"
                                        )} />
                                        {item.label}
                                    </span>
                                    {/* Example: notification badge */}
                                    {item.path === '/projects' && (
                                        <span className="ml-2 text-xs text-white font-bold bg-red-500 px-2 py-0.5 rounded-full z-10 shadow-sm">3</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Notifications (optional) */}
                    <div className="mt-8 mb-2">
                        {/* Example badge/alert. Replace with your notification logic if needed */}
                        <div className="rounded-xl bg-gradient-to-r from-pink-400/70 to-indigo-400/70 text-sm text-white font-medium px-4 py-2 flex items-center gap-3 shadow-lg shadow-indigo-300/10">
                            <Calendar className="h-5 w-5 opacity-80" />
                            <span>Event tonight at 7PM</span>
                        </div>
                    </div>

                    {/* User Profile block */}
                    <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700/50">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 dark:bg-neutral-800/80 border border-gray-100/70 hover:bg-white hover:shadow-xl transition-all duration-300 group cursor-pointer">
                            <Link to="/profile" className="flex items-center gap-3 flex-1 min-w-0">
                                <img
                                    src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"}
                                    alt="Profile"
                                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md group-hover:border-indigo-200 transition-colors"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-base font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-700 transition-colors">{user?.name || 'User'}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-300 truncate">{user?.email || 'user@example.com'}</p>
                                </div>
                            </Link>
                            <button onClick={logout} className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50" title="Logout">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
            <MobileNav />
            <UserSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default Sidebar;
