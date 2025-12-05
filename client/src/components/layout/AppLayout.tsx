import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

const AppLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop: Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="lg:pl-80 transition-all duration-300">
                <main className="min-h-screen pb-20 lg:pb-0">
                    <Outlet />
                </main>
            </div>

            {/* Mobile: Bottom Navigation */}
            <BottomNav />
        </div>
    );
};

export default AppLayout;
