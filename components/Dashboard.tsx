import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Wrench, CheckCircle, AlertTriangle, Wifi, Gauge, MapPin } from 'lucide-react';
import { Issue } from '../types';

interface DashboardProps {
  recentIssues: Issue[];
}

const data = [
  { name: 'Mon', problems: 4 },
  { name: 'Tue', problems: 3 },
  { name: 'Wed', problems: 7 },
  { name: 'Thu', problems: 2 },
  { name: 'Fri', problems: 6 },
  { name: 'Sat', problems: 8 },
  { name: 'Sun', problems: 5 },
];

const StatCard = ({ title, value, icon, color, subtext }: any) => (
  <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 hover:border-neon-blue/30 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-dark-900 ${color}`}>
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-400 bg-dark-900 px-2 py-1 rounded-full">{subtext}</span>
    </div>
    <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
    <p className="text-gray-400 text-sm">{title}</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ recentIssues }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Hello, Alex 👋</h1>
          <p className="text-gray-400 text-sm">Welcome back to your garage.</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          {/* DIY Tool Connection Status Badge */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-dark-800 rounded-lg border border-dark-700">
             <div className="relative">
                <Wifi size={16} className="text-gray-500" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
             </div>
             <span className="text-xs text-gray-400">OBD Tool: Disconnected</span>
          </div>
          <button className="bg-neon-blue text-dark-900 px-4 py-2 rounded-lg font-bold hover:bg-white transition-colors text-sm">
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Vehicle Hero Section */}
      <div className="relative w-full h-72 md:h-80 rounded-3xl overflow-hidden group shadow-2xl shadow-black/50 border border-dark-700">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-transparent to-transparent z-10"></div>
        
        <img 
          src={imgError ? "https://placehold.co/800x400/1F2833/66FCF1?text=My+Vehicle" : "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920"} 
          onError={() => setImgError(true)}
          alt="My Car" 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
        />
        
        <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20 w-full flex flex-col md:flex-row justify-between md:items-end">
          <div className="mb-4 md:mb-0">
            <div className="inline-block px-3 py-1 bg-neon-blue/20 border border-neon-blue/50 backdrop-blur-md rounded-full text-neon-blue text-xs font-bold mb-3">
              PRIMARY VEHICLE
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">Audi RS7 <span className="text-dark-700">Sportback</span></h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
               <span className="flex items-center bg-dark-900/50 px-2 py-1 rounded backdrop-blur-sm">
                 <Gauge className="mr-2 text-neon-blue" size={16}/> 45,200 mi
               </span>
               <span className="flex items-center bg-dark-900/50 px-2 py-1 rounded backdrop-blur-sm">
                 <Activity className="mr-2 text-emerald-400" size={16}/> Health: 94%
               </span>
               <span className="flex items-center bg-dark-900/50 px-2 py-1 rounded backdrop-blur-sm">
                 <MapPin className="mr-2 text-gray-400" size={16}/> San Francisco, CA
               </span>
            </div>
          </div>
          
          <div>
              <button className="w-full md:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center">
                  <Wrench className="mr-2" size={18} />
                  View Maintenance Log
              </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Issues" 
          value="2" 
          icon={<AlertTriangle size={24} className="text-yellow-400" />} 
          color="text-yellow-400"
          subtext="+1 this week"
        />
        <StatCard 
          title="Resolved" 
          value="14" 
          icon={<CheckCircle size={24} className="text-emerald-400" />} 
          color="text-emerald-400"
          subtext="Lifetime"
        />
        <StatCard 
          title="Est. Savings" 
          value="$450" 
          icon={<Activity size={24} className="text-neon-blue" />} 
          color="text-neon-blue"
          subtext="By DIY"
        />
        <StatCard 
          title="Garage" 
          value="2" 
          icon={<Wrench size={24} className="text-purple-400" />} 
          color="text-purple-400"
          subtext="Cars"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-dark-800 p-6 rounded-2xl border border-dark-700">
          <h2 className="text-lg font-bold text-white mb-6">Repair Activity</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#66FCF1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#66FCF1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C353F" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#9CA3AF" axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2833', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="problems" stroke="#66FCF1" strokeWidth={3} fillOpacity={1} fill="url(#colorProblems)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Issues List */}
        <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 overflow-hidden">
          <h2 className="text-lg font-bold text-white mb-4">Recent Community Fixes</h2>
          <div className="space-y-4">
            {recentIssues.slice(0, 4).map((issue) => (
              <div key={issue.id} className="flex items-center p-3 rounded-xl hover:bg-dark-700 transition-colors cursor-pointer group">
                <img 
                  src={issue.imageUrl || "https://picsum.photos/100/100"} 
                  className="w-12 h-12 rounded-lg object-cover border border-dark-600 group-hover:border-neon-blue" 
                  alt="Issue"
                />
                <div className="ml-3 overflow-hidden">
                  <h4 className="text-white font-medium truncate">{issue.title}</h4>
                  <p className="text-xs text-gray-500">{issue.car.make} {issue.car.model}</p>
                </div>
                <div className="ml-auto">
                   <span className={`text-xs px-2 py-1 rounded-full ${
                     issue.status === 'Solved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                   }`}>
                     {issue.status}
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;