import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Router } from './app/Router';
import { AppProvider } from './app/AppProvider';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        autoClose={5000}
        theme="colored"
        position="top-right"
        limit={3}
        newestOnTop
        pauseOnFocusLoss
      />
      <AppProvider>
        <Router />
      </AppProvider>

      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
