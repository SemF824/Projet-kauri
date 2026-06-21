import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { DarkModeProvider } from './contexts/DarkModeContext';

export default function App() {
  return (
    <DarkModeProvider>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 600,
            maxWidth: '340px',
          },
          actionButtonStyle: {
            background: '#B05B3B',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 700,
          },
        }}
      />
    </DarkModeProvider>
  );
}
