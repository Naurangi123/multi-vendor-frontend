import React, { useState } from 'react';

const Settings = () => {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      <div className="space-y-6">
        {/* Theme Selection */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-700">Theme</h3>
          <button 
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-lg text-white ${theme === 'light' ? 'bg-gray-600' : 'bg-indigo-600'}`}
          >
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>

        {/* Notification Preferences */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-700">Notifications</h3>
          <button 
            onClick={toggleNotifications}
            className={`px-4 py-2 rounded-lg text-white ${notifications ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {notifications ? 'Disable Notifications' : 'Enable Notifications'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
