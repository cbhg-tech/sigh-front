import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { PrivateRoute } from './PrivateRoute';

import { DashboardPage } from '../../pages/Dashboard';
import { LoginPage } from '../../pages/OnBoarding/Login';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
