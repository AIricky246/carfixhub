import React from 'react';
import { LayoutDashboard, PlusCircle, Users, Settings, Wrench } from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  setPage: (page: Page) => void;
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setPage, isMobile, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: Page.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: Page.NEW_ISSUE, label: 'Diagnose Issue', icon: <PlusCircle size={20} /> },
    { id: Page.COMMUNITY, label: 'Community', icon: <Users size={20} /> },
    { id: Page.SETTINGS, label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleNav = (page: Page) => {
    setPage(page);
    if (isMobile) setIsOpen(false);
  };

  const baseClasses = "fixed inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-dark-700 transition-transform duration-300 ease-in-out transform";
  const mobileClasses = isOpen ? "translate-x-0" : "-translate-x-full";
  const desktopClasses = "md:translate-x-0 md:static";

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses}`}>
        <div className="flex items-center h-16 px-6 border-b border-dark-700">
          <Wrench className="text-neon-blue mr-3" />
          <span className="text-xl font-bold text-white tracking-wider">CarFixHub</span>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                activePage === item.id
                  ? 'bg-neon-green/20 text-neon-blue font-medium shadow-lg shadow-neon-blue/5'
                  : 'text-gray-400 hover:bg-dark-700 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-dark-700">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-dark-900/50">
            <img 
              src="https://picsum.photos/40/40?random=99" 
              alt="User" 
              className="w-10 h-10 rounded-full border border-neon-blue"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Alex Mechanic</p>
              <p className="text-xs text-gray-500 truncate">Pro Member</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;