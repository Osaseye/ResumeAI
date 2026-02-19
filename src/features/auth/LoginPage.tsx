import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const LoginPage = () => {
  return (
    <AuthLayout 
      heading="Welcome back" 
      subheading="Please enter your details to sign in."
    >
      <LoginForm />
    </AuthLayout>
  );
};
