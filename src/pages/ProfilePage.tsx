import React from 'react';
import { Header } from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { User, Settings, LogOut } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-black">
      <Header user={user} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mr-4">
              <User className="w-8 h-8 text-gray-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-400">@{user?.username}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Account Settings</h3>
              
              <Button
                variant="outline"
                className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start border-red-700 text-red-400 hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Statistics</h3>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">0</div>
                <div className="text-gray-400 text-sm">Searches Made</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">0</div>
                <div className="text-gray-400 text-sm">Words Saved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
