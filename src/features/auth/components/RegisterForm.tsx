import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
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
      // Build a promise that resolves after 1.5 seconds
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log('Register data:', data);
      toast.success('Account created successfully!', {
        description: 'Welcome to Resume AI. You can now log in.',
      });
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed', {
        description: 'Something went wrong. Please try again.',
      });
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
          <div className="mt-1">
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className={`appearance-none block w-full px-3 py-3 border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-black focus:border-black'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm transition-colors`}
              placeholder="Create a password"
              disabled={isLoading}
              {...register('password')}
            />
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

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or sign up with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          disabled={isLoading}
          className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="sr-only">Sign up with Google</span>
          <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
             <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
          </svg>
          <span className="ml-2">Google</span>
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
