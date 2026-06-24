import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Context Providers
import { UIProvider } from './context/UIContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UIProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </UIProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
