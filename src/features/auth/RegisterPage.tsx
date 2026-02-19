import { AuthLayout } from '@/layouts/AuthLayout';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export const RegisterPage = () => {
  return (
    <AuthLayout 
      heading="Create an account" 
      subheading="Start building your career acceleration toolkit today."
    >
      <RegisterForm />
    </AuthLayout>
  );
};
