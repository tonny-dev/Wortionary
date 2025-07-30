import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { RegisterCredentials } from '@/types';
import { cn } from '@/lib/utils';

// Validation schema
const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  acceptTerms: z
    .boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterCredentials) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  onSwitchToLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const acceptTerms = watch('acceptTerms');

  const handleFormSubmit = async (data: RegisterFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-gray-400">Join Wortionary and expand your vocabulary</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Global Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-white">
              First Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                className={cn(
                  "pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400",
                  "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  errors.firstName && "border-red-500 focus:ring-red-500"
                )}
                {...register('firstName')}
                disabled={isLoading || isSubmitting}
              />
            </div>
            {errors.firstName && (
              <p className="text-red-400 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-white">
              Last Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                className={cn(
                  "pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400",
                  "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  errors.lastName && "border-red-500 focus:ring-red-500"
                )}
                {...register('lastName')}
                disabled={isLoading || isSubmitting}
              />
            </div>
            {errors.lastName && (
              <p className="text-red-400 text-sm">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Username Field */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-white">
            Username
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="username"
              type="text"
              placeholder="johndoe"
              className={cn(
                "pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400",
                "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                errors.username && "border-red-500 focus:ring-red-500"
              )}
              {...register('username')}
              disabled={isLoading || isSubmitting}
            />
          </div>
          {errors.username && (
            <p className="text-red-400 text-sm">{errors.username.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className={cn(
                "pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400",
                "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                errors.email && "border-red-500 focus:ring-red-500"
              )}
              {...register('email')}
              disabled={isLoading || isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              className={cn(
                "pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400",
                "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                errors.password && "border-red-500 focus:ring-red-500"
              )}
              {...register('password')}
              disabled={isLoading || isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              disabled={isLoading || isSubmitting}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-white">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              className={cn(
                "pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400",
                "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                errors.confirmPassword && "border-red-500 focus:ring-red-500"
              )}
              {...register('confirmPassword')}
              disabled={isLoading || isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              disabled={isLoading || isSubmitting}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setValue('acceptTerms', !!checked)}
              disabled={isLoading || isSubmitting}
              className="mt-1"
            />
            <Label
              htmlFor="acceptTerms"
              className="text-sm text-gray-300 cursor-pointer leading-relaxed"
            >
              I agree to the{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                Privacy Policy
              </a>
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-red-400 text-sm">{errors.acceptTerms.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>

        {/* Switch to Login */}
        {onSwitchToLogin && (
          <div className="text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                disabled={isLoading || isSubmitting}
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
