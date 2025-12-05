import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Plane, Calendar, Users, User } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const MobileNav: React.FC = () => {
    const { pathname } = useLocation();

    const navItems = [
        { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
        { path: '/travel', label: 'Travel', icon: Plane },
        { path: '/events', label: 'Events', icon: Calendar },
        { path: '/social', label: 'Social', icon: Users },
        { path: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 z-50 lg:hidden safe-area-bottom">
            <nav className="flex justify-between items-center">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="relative flex flex-col items-center p-2"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="mobileActiveTab"
                                    className="absolute -top-2 w-8 h-1 bg-primary-500 rounded-full"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <Icon className={clsx(
                                "w-6 h-6 mb-1 transition-colors",
                                isActive ? "text-primary-600" : "text-gray-400"
                            )} />
                            <span className={clsx(
                                "text-[10px] font-medium transition-colors",
                                isActive ? "text-primary-600" : "text-gray-400"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default MobileNav;
