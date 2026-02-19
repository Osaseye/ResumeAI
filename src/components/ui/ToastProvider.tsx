import { Toaster } from 'sonner';

export const ToastProvider = () => {
  return (
    <Toaster 
      position="top-center" 
      richColors 
      closeButton
      theme="light"
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #E5E7EB',
          color: '#111827',
          fontFamily: 'Inter, sans-serif'
        },
      }}
    />
  );
};
