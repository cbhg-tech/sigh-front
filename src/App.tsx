import { Router } from './app/Router';
import { AppProvider } from './app/AppProvider';

export function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
