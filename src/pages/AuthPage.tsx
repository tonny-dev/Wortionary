import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuthStore } from '@/store/authStore';
import type { LoginCredentials, RegisterCredentials } from '@/types';

type AuthMode = 'login' | 'register' | 'forgot-password';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const { login, register, isLoading, error } = useAuthStore();

  const handleLogin = async (credentials: LoginCredentials) => {
    await login(credentials);
  };

  const handleRegister = async (credentials: RegisterCredentials) => {
    await register(credentials);
  };

  const handleForgotPassword = () => {
    setMode('forgot-password');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20" />
      <div className="absolute inset-0 bg-[url('/task1/hero-bg.png')] bg-cover bg-center opacity-10" />
      
      {/* Content */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/task1/logo.png" 
              alt="Wortionary logo" 
              className="w-12 h-12"
            />
            <h1 className="text-3xl font-bold text-white">Wortionary</h1>
          </div>
          <p className="text-gray-400">
            Your comprehensive dictionary for modern language
          </p>
        </div>

        {/* Auth Forms */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
          {mode === 'login' && (
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={error || undefined}
              onForgotPassword={handleForgotPassword}
              onSwitchToRegister={() => setMode('register')}
            />
          )}

          {mode === 'register' && (
            <RegisterForm
              onSubmit={handleRegister}
              isLoading={isLoading}
              error={error || undefined}
              onSwitchToLogin={() => setMode('login')}
            />
          )}

          {mode === 'forgot-password' && (
            <ForgotPasswordForm
              onBack={() => setMode('login')}
            />
          )}
        </div>

        {/* Features Preview */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Join thousands of users exploring modern language
          </p>
          <div className="flex justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              50,000+ Words
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              Real-time Trends
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
              Audio Pronunciation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Forgot Password Form Component
interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to send reset email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
        <p className="text-gray-400 mb-6">
          We've sent a password reset link to {email}
        </p>
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Forgot Password</h2>
        <p className="text-gray-400">
          Enter your email address and we'll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-white mb-2">
            Email Address
          </label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !email.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full text-gray-400 hover:text-white transition-colors"
          disabled={isLoading}
        >
          Back to login
        </button>
      </form>
    </div>
  );
};
