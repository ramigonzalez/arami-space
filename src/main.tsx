import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './hooks/useAuth.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  // Temporarily disabled StrictMode to test profile loading race condition
  // <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  // </StrictMode>
);
