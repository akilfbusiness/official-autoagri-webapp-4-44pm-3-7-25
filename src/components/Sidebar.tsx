import React from 'react';
import { X, Home, Database, Settings, Wrench } from 'lucide-react';

type PageType = 'dashboard' | 'database';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: PageType;
  onNavigate: (page: PageType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activePage,
  onNavigate,
}) => {
  const navigationItems = [
    {
      id: 'dashboard' as PageType,
      label: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      description: 'Job card management and portals',
    },
    {
      id: 'database' as PageType,
      label: 'Database',
      icon: <Database className="h-5 w-5" />,
      description: 'Database management and analytics',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">AutoAgri</h2>
              <p className="text-sm text-gray-500">Navigation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-6">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  activePage === item.id
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className={`flex-shrink-0 ${
                  activePage === item.id ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">System Version</p>
              <p className="text-xs text-gray-500">v1.0.0 - January 2025</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};