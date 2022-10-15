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
import { TransferListApprovalPage } from '../../pages/Transfer/ListApproval';
import { TransferApprovalWorkflow } from '../../pages/Transfer/ApprovalWorkflow';
import { AthletesReportPage } from '../../pages/Athletes/Report';
import { TechnicalCommitteeListPage } from '../../pages/TechnicalCommittee/List';
import { ListTransfersPage } from '../../pages/Transfer/List';
import { TechnicalCommitteeRegisterPage } from '../../pages/TechnicalCommittee/Register';
import { PartnerProjectListPage } from '../../pages/PartnerProject/List';
import { PartnerProjectRegisterPage } from '../../pages/PartnerProject/Register';
import { PartnerProjectDetailsPage } from '../../pages/PartnerProject/Details';
import { FederationDetailsPage } from '../../pages/Federation/Details';
import { TeamDetailsPage } from '../../pages/Team/Details';
import { AthleteDetailsPage } from '../../pages/Athletes/Details';

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
            path="/app/atletas/detalhes/:id"
            element={
              <Navigation title="Detalhes do atleta">
                <AthleteDetailsPage />
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
            path="/app/restrito/atletas/relatorio"
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
            path="/app/tecnico/listagem"
            element={
              <Navigation title="Comissão técnica">
                <TechnicalCommitteeListPage />
              </Navigation>
            }
          />
          <Route
            path="/app/tecnico/cadastro"
            element={
              <Navigation title="Cadastro de comissão técnica">
                <TechnicalCommitteeRegisterPage />
              </Navigation>
            }
          />
          <Route
            path="/app/tecnico/detalhes/:id"
            element={
              <Navigation title="Detalhes da comissão técnica">
                <TechnicalCommitteeRegisterPage isDisplayMode />
              </Navigation>
            }
          />
          <Route
            path="/app/projetosparceiros/listagem"
            element={
              <Navigation title="Projetos parceiros">
                <PartnerProjectListPage />
              </Navigation>
            }
          />
          <Route
            path="/app/projetosparceiros/detalhes/:id"
            element={
              <Navigation title="Projeto parceiro">
                <PartnerProjectDetailsPage />
              </Navigation>
            }
          />
          <Route
            path="/app/projetosparceiros/cadastro"
            element={
              <Navigation title="Cadastro de projetos parceiros">
                <PartnerProjectRegisterPage />
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
            path="/app/federacoes/detalhes/:id"
            element={
              <Navigation title="Detalhes da federações">
                <FederationDetailsPage />
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
            path="/app/clubes/detalhes/:id"
            element={
              <Navigation title="Detalhes do clube">
                <TeamDetailsPage />
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
            path="/app/restrito/transferencia/listagem/pendentes"
            element={
              <Navigation title="Aprovação de transferência">
                <TransferListApprovalPage />
              </Navigation>
            }
          />
          <Route
            path="/app/restrito/transferencia/listagem"
            element={
              <Navigation title="Aprovação de transferência">
                <ListTransfersPage />
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
          <Route
            path="/app/restrito/transferencia/detalhes/:id"
            element={
              <Navigation title="Detalhes de transferência">
                <TransferApprovalWorkflow isDisplayOnly />
              </Navigation>
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
