import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { PrivateRoute } from './PrivateRoute';

import { DashboardPage } from '../../pages/Dashboard';
import { LoginPage } from '../../pages/OnBoarding/Login';
import { RegisterPage } from '../../pages/OnBoarding/Register';
import { ForgotPasswordPage } from '../../pages/OnBoarding/ForgotPassword';
import { Navigation } from '../../components/Navigation';
import { ListAthletesPage } from '../../pages/List/Athletes';
import { UserListPage } from '../../pages/User/List';
import { UserRegisterPage } from '../../pages/User/Register';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/esqueceu-a-senha" element={<ForgotPasswordPage />} />
        <Route path="/app" element={<PrivateRoute />}>
          <Route
            path="/app/dashboard"
            element={
              <Navigation title="Dashboard">
                <DashboardPage />
              </Navigation>
            }
          />
          <Route
            path="/app/listagem/atletas"
            element={
              <Navigation title="Atletas">
                <ListAthletesPage />
              </Navigation>
            }
          />
          <Route
            path="/app/usuarios/listagem"
            element={
              <Navigation title="Usuário do sistema">
                <UserListPage />
              </Navigation>
            }
          />
          <Route
            path="/app/usuarios/cadastro"
            element={
              <Navigation title="Cadastro de Usuário">
                <UserRegisterPage />
              </Navigation>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
