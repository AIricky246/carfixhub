import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import IssueForm from './components/IssueForm';
import CommunityFeed from './components/CommunityFeed';
import Settings from './components/Settings';
import { Page, Issue } from './types';
import { MOCK_ISSUES } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);

  // Hook to detect mobile screen size (simplified for this demo)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNewIssue = (issue: Issue) => {
    setIssues([issue, ...issues]);
    // Optionally switch to feed or stay on result
  };

  const renderContent = () => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard recentIssues={issues} />;
      case Page.NEW_ISSUE:
        return <IssueForm onIssueCreated={handleNewIssue} />;
      case Page.COMMUNITY:
        return <CommunityFeed issues={issues} />;
      case Page.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard recentIssues={issues} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex text-gray-200 font-sans selection:bg-neon-blue selection:text-dark-900">
      <Sidebar 
        activePage={currentPage} 
        setPage={setCurrentPage} 
        isMobile={isMobile}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-h-screen w-full transition-all duration-300">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-dark-800 border-b border-dark-700 sticky top-0 z-30">
           <button onClick={() => setSidebarOpen(true)} className="text-white">
             <Menu size={24} />
           </button>
           <span className="font-bold text-lg text-white">CarFixHub</span>
           <div className="w-6" /> {/* Spacer */}
        </div>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;