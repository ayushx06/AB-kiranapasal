import { Toaster } from 'react-hot-toast';

export const Toast = () => (
  <Toaster
    position="top-center"
    toastOptions={{
      style: { borderRadius: '10px', fontWeight: 600 },
      success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
      error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } }
    }}
  />
);
