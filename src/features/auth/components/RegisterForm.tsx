import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../lib/firebase';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      console.log('Register data:', data);
      toast.success('Account created successfully!', {
        description: 'Welcome to Resume AI. Let us setup your profile.',
      });
      // Navigate to onboarding with user data
      navigate('/onboarding', { 
        state: { 
          firstName: data.firstName, 
          lastName: data.lastName 
        } 
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use. Please log in.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak.';
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <div className="mt-1">
              <input
                id="firstName"
                type="text"
                className={`appearance-none block w-full px-3 py-3 border ${errors.firstName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-black focus:border-black'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm transition-colors`}
                placeholder="John"
                disabled={isLoading}
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <div className="mt-1">
              <input
                id="lastName"
                type="text"
                className={`appearance-none block w-full px-3 py-3 border ${errors.lastName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-black focus:border-black'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm transition-colors`}
                placeholder="Doe"
                disabled={isLoading}
                {...register('lastName')}
              />
               {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`appearance-none block w-full px-3 py-3 border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-black focus:border-black'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm transition-colors`}
              placeholder="you@example.com"
              disabled={isLoading}
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
            <input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              autoComplete="new-password"
              className={`appearance-none block w-full px-3 py-3 pr-10 border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-black focus:border-black'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm transition-colors`}
              placeholder="Create a password"
              disabled={isLoading}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {isPasswordVisible ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
              </svg>
              ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              )}
            </button>
            </div>
          {errors.password ? (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          ) : (
             <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               <span>Creating account...</span>
            </div>
          ) : (
            'Create account'
          )}
        </button>
      </div>

      <p className="mt-2 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-black hover:text-gray-700 underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  );
};
