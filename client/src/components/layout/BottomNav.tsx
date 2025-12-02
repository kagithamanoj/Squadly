import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Home,
    Plane,
    PartyPopper,

    Users,
} from 'lucide-react';

const BottomNav: React.FC = () => {
    const { pathname } = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
        { icon: Home, label: 'House', path: '/home' },
        { icon: Plane, label: 'Travel', path: '/travel' },
        { icon: PartyPopper, label: 'Events', path: '/events' },
        { icon: Users, label: 'Social', path: '/social' },
    ];

    const isActive = (path: string) => {
        if (path === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(path);
    };

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <div className="grid grid-cols-5 h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center space-y-1 ${active ? 'text-orange-600' : 'text-gray-600'
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
