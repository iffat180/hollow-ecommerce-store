'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        // Default options
        duration: 3000,
        style: {
          background: '#ffffff',
          color: '#3a3a3a',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          fontFamily: 'Roboto, sans-serif',
        },
        // Success toast
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#c46a44',
            secondary: '#ffffff',
          },
        },
        // Error toast
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}