import React, { useState } from 'react';
import { User, Car, Wifi, Bell, Shield, Save, LogOut, CreditCard, Smartphone, Zap } from 'lucide-react';

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ name: 'Alex Mechanic', email: 'alex@garage.com', isPro: true });
  const [vehicle, setVehicle] = useState({ make: 'Audi', model: 'RS7 Sportback', year: '2016', mileage: '45,200', vin: 'WAUZZZ...' });
  const [toolConfig, setToolConfig] = useState({ ip: '192.168.1.105', port: '8080', autoConnect: true });
  const [notifications, setNotifications] = useState({ maintenance: true, community: false, offers: true });

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-white">Settings & Preferences</h1>
           <p className="text-gray-400 text-sm">Manage your account, garage, and diagnostic tools.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-neon-blue hover:bg-white text-dark-900 px-6 py-2 rounded-lg font-bold transition-all flex items-center space-x-2 shadow-lg shadow-neon-blue/10"
        >
          {loading ? <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin"/> : <Save size={18} />}
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Profile Section */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <User className="mr-2 text-neon-blue" size={20} /> User Profile
            </h3>
            <div className="flex items-start space-x-6">
              <div className="relative group cursor-pointer">
                <img 
                  src="https://picsum.photos/40/40?random=99" 
                  alt="Avatar" 
                  className="w-20 h-20 rounded-full border-2 border-dark-600 group-hover:border-neon-blue transition-colors object-cover" 
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-white font-bold">Edit</span>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Display Name</label>
                    <input 
                      type="text" 
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-neon-blue focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-neon-blue focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                {profile.isPro && (
                  <div className="flex items-center p-3 bg-gradient-to-r from-neon-blue/10 to-transparent rounded-lg border border-neon-blue/20">
                    <Shield className="text-neon-blue mr-3" size={18} />
                    <div>
                      <p className="text-sm font-bold text-white">CarFixHub Pro Active</p>
                      <p className="text-xs text-gray-400">Next billing date: Dec 24, 2024</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Primary Vehicle Section */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <Car className="mr-2 text-neon-green" size={20} /> Primary Vehicle
                </h3>
                <button className="text-xs text-neon-blue hover:text-white underline">Manage Garage</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Make</label>
                  <input 
                    type="text" 
                    value={vehicle.make}
                    onChange={(e) => setVehicle({...vehicle, make: e.target.value})}
                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-neon-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Model</label>
                  <input 
                    type="text" 
                    value={vehicle.model}
                    onChange={(e) => setVehicle({...vehicle, model: e.target.value})}
                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-neon-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Year</label>
                  <input 
                    type="text" 
                    value={vehicle.year}
                    onChange={(e) => setVehicle({...vehicle, year: e.target.value})}
                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-neon-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Mileage</label>
                  <input 
                    type="text" 
                    value={vehicle.mileage}
                    onChange={(e) => setVehicle({...vehicle, mileage: e.target.value})}
                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-neon-blue focus:outline-none"
                  />
                </div>
             </div>
          </div>
          
          {/* DIY Hardware Config */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Zap size={100} className="text-neon-blue" />
             </div>
             <h3 className="text-lg font-bold text-white mb-2 flex items-center">
               <Wifi className="mr-2 text-purple-400" size={20} /> DIY Diagnostic Tool
             </h3>
             <p className="text-sm text-gray-400 mb-6 max-w-lg">
               Configure your Raspberry Pi / ESP32 OBD-II bridge. This allows the AI to read real-time telemetry and engine codes.
             </p>

             <div className="bg-dark-900/50 rounded-xl p-4 border border-dark-600 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-sm font-bold text-gray-300">Status: Disconnected</span>
                  </div>
                  <button className="text-xs bg-dark-700 hover:bg-dark-600 px-3 py-1 rounded text-white border border-dark-500">
                    Test Connection
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Device IP Address</label>
                      <input 
                        type="text" 
                        value={toolConfig.ip} 
                        onChange={(e) => setToolConfig({...toolConfig, ip: e.target.value})}
                        className="w-full bg-dark-800 border border-dark-600 rounded px-3 py-2 text-sm text-white font-mono"
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Port</label>
                      <input 
                        type="text" 
                        value={toolConfig.port} 
                        onChange={(e) => setToolConfig({...toolConfig, port: e.target.value})}
                        className="w-full bg-dark-800 border border-dark-600 rounded px-3 py-2 text-sm text-white font-mono"
                      />
                   </div>
                </div>
             </div>
             <div className="flex items-center space-x-2">
               <input 
                 type="checkbox" 
                 id="autoConnect"
                 checked={toolConfig.autoConnect}
                 onChange={(e) => setToolConfig({...toolConfig, autoConnect: e.target.checked})}
                 className="rounded bg-dark-900 border-dark-600 text-neon-blue focus:ring-neon-blue"
               />
               <label htmlFor="autoConnect" className="text-sm text-gray-400">Auto-connect when app opens</label>
             </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
           
           {/* Notifications */}
           <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Bell className="mr-2 text-yellow-400" size={20} /> Notifications
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Maintenance Reminders</span>
                    <button 
                      onClick={() => setNotifications({...notifications, maintenance: !notifications.maintenance})}
                      className={`w-10 h-6 rounded-full p-1 transition-colors ${notifications.maintenance ? 'bg-neon-blue' : 'bg-dark-600'}`}
                    >
                       <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${notifications.maintenance ? 'translate-x-4' : ''}`} />
                    </button>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Community Replies</span>
                    <button 
                      onClick={() => setNotifications({...notifications, community: !notifications.community})}
                      className={`w-10 h-6 rounded-full p-1 transition-colors ${notifications.community ? 'bg-neon-blue' : 'bg-dark-600'}`}
                    >
                       <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${notifications.community ? 'translate-x-4' : ''}`} />
                    </button>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Part Offers</span>
                    <button 
                      onClick={() => setNotifications({...notifications, offers: !notifications.offers})}
                      className={`w-10 h-6 rounded-full p-1 transition-colors ${notifications.offers ? 'bg-neon-blue' : 'bg-dark-600'}`}
                    >
                       <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${notifications.offers ? 'translate-x-4' : ''}`} />
                    </button>
                 </div>
              </div>
           </div>

           {/* Appearance */}
           <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Smartphone className="mr-2 text-gray-400" size={20} /> App Appearance
              </h3>
              <div className="space-y-3">
                 <button className="w-full flex items-center justify-between p-3 rounded-lg bg-dark-900 border border-neon-blue/30 text-white">
                    <span className="text-sm">Dark Neon (Default)</span>
                    <div className="w-4 h-4 bg-neon-blue rounded-full"></div>
                 </button>
                 <button className="w-full flex items-center justify-between p-3 rounded-lg bg-dark-900 border border-dark-600 text-gray-400 hover:border-gray-500">
                    <span className="text-sm">High Contrast</span>
                    <div className="w-4 h-4 bg-white rounded-full border border-gray-600"></div>
                 </button>
              </div>
           </div>
           
           <div className="pt-4 border-t border-dark-700">
             <button className="w-full flex items-center justify-center space-x-2 text-red-500 bg-red-500/10 hover:bg-red-500/20 py-3 rounded-xl transition-colors font-medium">
                <LogOut size={18} />
                <span>Log Out</span>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
