import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { PrivateRoute } from './PrivateRoute';

import { DashboardPage } from '../../pages/Dashboard';
import { LoginPage } from '../../pages/OnBoarding/Login';
import { RegisterPage } from '../../pages/OnBoarding/Register';
import { ForgotPasswordPage } from '../../pages/OnBoarding/ForgotPassword';
import { Navigation } from '../../components/Navigation';
import { AthletesListPage } from '../../pages/Athletes/List';
import { UserListPage } from '../../pages/User/List';
import { UserRegisterPage } from '../../pages/User/Register';
import { NotFoundPage } from '../../pages/NotFound';
import { FederationListPage } from '../../pages/Federation/List';
import { FederationRegisterPage } from '../../pages/Federation/Register';
import { TeamRegisterPage } from '../../pages/Team/Register';
import { TeamListPage } from '../../pages/Team/List';
import { AthletesRegisterPage } from '../../pages/Athletes/Register';
import { AthleteApprovalListPage } from '../../pages/AthleteApproval/List';
import { ApprovalDetailsPage } from '../../pages/AthleteApproval/Details';
import { TransferRequestPage } from '../../pages/Transfer/Request';
import { TransferListPage } from '../../pages/Transfer/List';
import { TransferApprovalWorkflow } from '../../pages/Transfer/ApprovalWorkflow';
import { AthletesReportPage } from '../../pages/Athletes/Report';

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
            path="/app/atletas/listagem"
            element={
              <Navigation title="Atletas">
                <AthletesListPage />
              </Navigation>
            }
          />
          <Route
            path="/app/atletas/cadastro"
            element={
              <Navigation title="Atletas">
                <AthletesRegisterPage />
              </Navigation>
            }
          />
          <Route
            path="/app/atletas/relatorio"
            element={<AthletesReportPage />}
          />
          <Route
            path="/app/perfil"
            element={
              <Navigation title="Meu perfil">
                <AthletesRegisterPage />
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
          <Route
            path="/app/federacoes/listagem"
            element={
              <Navigation title="Federações">
                <FederationListPage />
              </Navigation>
            }
          />
          <Route
            path="/app/federacoes/cadastro"
            element={
              <Navigation title="Cadastro de Federação">
                <FederationRegisterPage />
              </Navigation>
            }
          />
          <Route
            path="/app/clubes/listagem"
            element={
              <Navigation title="Clubes">
                <TeamListPage />
              </Navigation>
            }
          />
          <Route
            path="/app/clubes/cadastro"
            element={
              <Navigation title="Cadastro de Clubes">
                <TeamRegisterPage />
              </Navigation>
            }
          />
          <Route
            path="/app/restrito/atletas/aprovacao"
            element={
              <Navigation title="Aprovação de fichas">
                <AthleteApprovalListPage />
              </Navigation>
            }
          />
          <Route
            path="/app/restrito/atletas/aprovacao/:id"
            element={
              <Navigation title="Aprovação de fichas">
                <ApprovalDetailsPage />
              </Navigation>
            }
          />
          <Route
            path="/app/transferencia/solicitacao"
            element={
              <Navigation title="Transferência">
                <TransferRequestPage />
              </Navigation>
            }
          />
          <Route
            path="/app/restrito/transferencia/listagem"
            element={
              <Navigation title="Aprovação de transferência">
                <TransferListPage />
              </Navigation>
            }
          />
          <Route
            path="/app/restrito/transferencia/aprovacao/:id"
            element={
              <Navigation title="Aprovação de transferência">
                <TransferApprovalWorkflow />
              </Navigation>
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
