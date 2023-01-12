import { MdInfo, MdOpenInNew } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { DateService } from '../../../services/DateService';
import { Status } from '../../../enums/Status';
import { Badge } from '../../../components/Badge';
import { defineAthleteCategory } from '../../../services/defineAthleteCategory';
import { useGetOneAthlete } from '../../../dataAccess/hooks/athlete/useGetOneAthlete';
import { Alert } from '../../../components/Alert';
import { useHasPermission } from '../../../hooks/useHasPermission';
import { Roles } from '../../../enums/Roles';
import { useGlobal } from '../../../contexts/global.context';
import { useApprovalAlert } from '../../../hooks/useApprovalAlert';
import { checkIfAthleteIsActiveOrPending } from '../../../utils/checkIfAthleteIsActiveOrPending';

const USER_NOT_FOUND_IMG =
  'https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/96/1A1A1A/external-user-user-tanah-basah-glyph-tanah-basah-4.png';

export function AthleteDetailsPage() {
  const { id } = useParams();
  const { user } = useGlobal();
  const { data, isLoading, isSuccess } = useGetOneAthlete(id);
  const isAdmin = useHasPermission([Roles.ADMIN]);
  const isManager = useHasPermission([Roles.ADMINCLUBE, Roles.ADMINFEDERACAO]);
  const { approvalAlertData, isLoadingApproval } = useApprovalAlert(data);

  const checkIfCanRenderDetails = () => {
    if (
      isManager &&
      user?.relatedType === 'team' &&
      data?.relatedId !== user?.relatedId
    )
      return true;

    if (
      isManager &&
      user?.relatedType === 'federation' &&
      data?.related.federationId !== user?.relatedId
    )
      return true;

    if (isAdmin) return true;

    return false;
  };

  const renderDetails = () => {
    if (!checkIfCanRenderDetails()) return null;

    if (!data) return <p>Dados do usuário não encontrados</p>;

    const { commitmentTerm, medicalCertificate, noc, personalDocument } =
      data.athleteProfile?.documents || {};

    return (
      <>
        {data.athleteProfile?.address && (
          <>
            <h2 className="text-3xl text-light-on-surface my-4">Endereço</h2>
            <p className="text-light-on-surface-variant">
              {data.athleteProfile?.address.cep || ''}
              <br />
              {data.athleteProfile?.address.street || ''} -{' '}
              {data.athleteProfile?.address.number || ''},{' '}
              {data.athleteProfile?.address.city || ''},{' '}
              {data.athleteProfile?.address.state || ''},{' '}
              {data.athleteProfile?.address.country || ''}
            </p>
          </>
        )}

        {data.athleteProfile?.hospitalData && (
          <>
            <h2 className="text-3xl text-light-on-surface my-4">
              Dados hospitalar
            </h2>
            <p className="text-light-on-surface-variant">
              <strong>Tipo sanguíneo: </strong>
              {data.athleteProfile?.hospitalData.bloodType}
              <br />
              <strong>Alergias: </strong>
              {data.athleteProfile?.hospitalData.allergies}
              <br />
              <strong>Doenças crônicas: </strong>
              {data.athleteProfile?.hospitalData.chronicDiseases}
              <br />
              <strong>Medicamentos regulares: </strong>
              {data.athleteProfile?.hospitalData.chronicDiseases}
              <br />
            </p>
          </>
        )}

        {data.athleteProfile?.emergencyContact && (
          <>
            <h2 className="text-3xl text-light-on-surface my-4">
              Contato de emergência
            </h2>
            <p className="text-light-on-surface-variant">
              <strong>Nome: </strong>
              {data.athleteProfile?.emergencyContact.name}
              <br />
              <strong>Telefone: </strong>
              {data.athleteProfile?.emergencyContact.phone}
            </p>
          </>
        )}

        <p className="text-light-on-surface-variant">
          {personalDocument && (
            <>
              <h2 className="text-3xl text-light-on-surface my-4">
                Documentos
              </h2>
              <a
                href={personalDocument}
                target="_blank"
                download
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <MdOpenInNew size="1.25rem" className="text-light-on-surface" />
                Documento pessoal
              </a>
              <br />
            </>
          )}

          {commitmentTerm && (
            <>
              <a
                href={commitmentTerm}
                target="_blank"
                download
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <MdOpenInNew size="1.25rem" className="text-light-on-surface" />
                Termo de compromisso
              </a>
              <br />
            </>
          )}

          {medicalCertificate && (
            <>
              <a
                href={medicalCertificate}
                target="_blank"
                download
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <MdOpenInNew size="1.25rem" className="text-light-on-surface" />
                Certificado médico
              </a>
              <br />
            </>
          )}

          {noc && (
            <a
              href={noc}
              target="_blank"
              download
              rel="noreferrer"
              className="flex items-center gap-2"
            >
              <MdOpenInNew size="1.25rem" className="text-light-on-surface" />
              NOC
            </a>
          )}
        </p>
      </>
    );
  };

  return (
    <>
      {approvalAlertData?.canShowAlert && (
        <Alert
          variant={approvalAlertData?.alertType || 'warning'}
          title="Aviso"
          message={
            isLoadingApproval ? 'Carregando...' : approvalAlertData?.message
          }
        />
      )}
      <div className="bg-light-surface p-6 rounded-2xl h-full">
        {!isLoading && isSuccess && data ? (
          <>
            <div className="flex flex-col md:flex-row gap-2 items-center mb-4">
              <figure className="w-24 h-24 rounded-full">
                <img
                  src={data?.photoUrl || USER_NOT_FOUND_IMG}
                  alt={data?.name}
                  className="w-24 h-24 z-0 rounded-full object-cover bg-light-secondary-container"
                />
              </figure>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-4xl text-light-on-surface-variant">
                    {data?.name}
                  </h2>
                  {checkIfAthleteIsActiveOrPending(data) === 'Active' && (
                    <Badge type="primary">Ativo</Badge>
                  )}
                  {checkIfAthleteIsActiveOrPending(data) === 'Pending' && (
                    <Badge type="warning">Pendente</Badge>
                  )}
                  {data?.status === Status.REJECTED && (
                    <Badge type="error">Rejeitado</Badge>
                  )}
                  {data?.status === Status.INACTIVE && (
                    <Badge type="error">Inativo</Badge>
                  )}
                </div>
                <p className="text-2xl text-light-on-surface-variant">
                  {data?.related?.name || 'Sem time'} -{' '}
                  {defineAthleteCategory(data!.athleteProfile!.birthDate)}
                </p>
              </div>
            </div>
            <div className="mb-8 flex gap-4">
              <div>
                <MdInfo
                  size="1.75rem"
                  className="text-light-on-surface-variant"
                />
              </div>
              <div>
                <h2 className="text-3xl text-light-on-surface-variant">
                  Detalhes
                </h2>

                <p className="text-light-on-surface-variant">
                  <strong>Nº Registro: </strong>
                  {data?.athleteProfile?.registerNumber}
                </p>
                <p className="text-light-on-surface-variant">
                  <strong>Data de nascimento: </strong>
                  {DateService().format(data!.athleteProfile!.birthDate!)}
                </p>
                <p className="text-light-on-surface-variant">
                  <strong>País de origem: </strong>
                  {data?.athleteProfile?.country}
                </p>
                <div>{renderDetails()}</div>
              </div>
            </div>
          </>
        ) : (
          <div>
            <h2 className="text-3xl text-light-on-surface-variant">
              Carregando...
            </h2>
          </div>
        )}
      </div>
    </>
  );
}
