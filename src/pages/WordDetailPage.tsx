import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useAuthStore } from '@/store/authStore';

export const WordDetailPage: React.FC = () => {
  const { word } = useParams<{ word: string }>();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-black">
      <Header 
        user={user ? {
          name: `${user.firstName} ${user.lastName}`,
          initials: `${user.firstName[0]}${user.lastName[0]}`,
          avatar: user.avatar
        } : undefined}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            Word Detail: {word}
          </h1>
          <p className="text-gray-400">
            Detailed word information coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};
