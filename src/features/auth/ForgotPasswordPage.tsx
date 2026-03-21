import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { AuthLayout } from '@/layouts/AuthLayout';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
    return (
        <AuthLayout 
            heading="Reset Password" 
            subheading="Enter your email to receive a reset link."
        >
            <ForgotPasswordForm />
        </AuthLayout>
    );
};

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);

      console.log('Reset request for:', data);
      toast.success('Reset link sent!', {
        description: 'Check your email for instructions to reset your password.',
      });
      navigate('/login');
    } catch (error: any) {
      toast.error('Request failed', {
        description: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
            <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
            {isLoading ? (
                <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sending...</span>
                </div>
            ) : (
                'Send Reset Link'
            )}
            </button>
        </div>
        </form>

        <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign in
                </Link>
            </p>
        </div>
    </div>
  );
};
