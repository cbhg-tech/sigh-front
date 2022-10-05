import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { MdCheck, MdOpenInNew } from 'react-icons/md';
import { toast } from 'react-toastify';
import { CgSpinner } from 'react-icons/cg';
import { useGetAppovalDetails } from '../../../dataAccess/hooks/athlete/useGetApprovalDetails';
import { MultineTextfieldBare } from '../../../components/Inputs/MultilineTextfieldBare';
import { Button } from '../../../components/Inputs/Button';
import { useUpdateApprovalStatus } from '../../../dataAccess/hooks/athlete/useUpdateApprovalStatus';
import { useGlobal } from '../../../contexts/global.context';
import { Roles } from '../../../enums/Roles';
import { Status } from '../../../enums/Status';

export function ApprovalDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useGlobal();

  const { data } = useGetAppovalDetails(id);
  const { mutateAsync, isLoading } = useUpdateApprovalStatus();
  const [note, setNote] = useState('');

  useEffect(() => {
    if (data) {
      const { approval } = data;

      switch (user?.role) {
        case Roles.ADMINCLUBE:
          setNote(approval?.logTeam || '');
          break;
        case Roles.ADMINFEDERACAO:
        case Roles.ADMIN:
          setNote(approval?.logCbhg || '');
          break;
        default:
          throw new Error('Você não tem permissão para aprovar');
      }
    }
  }, [data, user]);

  const handleApprove = async (isApproved: boolean) => {
    const approvalData = data?.approval;

    if (!approvalData) throw new Error('Approval data not found');

    try {
      if (!isApproved && !note)
        throw new Error('Por favor adicione uma observação');

      let isAllowedToApprove = false;

      switch (user?.role) {
        case Roles.ADMINFEDERACAO:
        case Roles.ADMINCLUBE:
        case Roles.ADMIN:
          isAllowedToApprove = true;
          break;
        default:
          break;
      }

      if (!isAllowedToApprove)
        throw new Error('Você não tem permissão para aprovar');

      if (isApproved) {
        switch (user?.role) {
          case Roles.ADMINCLUBE:
            approvalData.teamApproved = isApproved;
            approvalData.logTeam = note;
            break;
          case Roles.ADMINFEDERACAO:
          case Roles.ADMIN:
            approvalData.cbhgApproved = isApproved;
            approvalData.logCbhg = note;
            break;
          default:
            throw new Error('Você não tem permissão para aprovar');
        }

        if (approvalData.cbhgApproved && approvalData.teamApproved)
          approvalData.status = Status.ACTIVE;
      } else {
        approvalData.status = Status.REJECTED;

        if (user?.role === Roles.ADMINCLUBE) approvalData.logTeam = note;
        if (user?.role === Roles.ADMINFEDERACAO) approvalData.logTeam = note;
      }

      await mutateAsync({ ...approvalData });

      toast.success('Aprovação feita com sucesso');

      navigate('/app/restrito/atletas/aprovacao');
    } catch (error) {
      // @ts-ignore
      toast.error(error.message);
    }
  };

  const renderDetails = () => {
    if (!data?.user) return <p>Dados do usuário não encontrados</p>;

    const { user } = data;

    if (!user.athleteProfile) return <p>Dados do usuário incompletos</p>;

    const { athleteProfile } = user;
    const { emergencyContact, hospitalData, address } = athleteProfile;

    const { commitmentTerm, medicalCertificate, noc, personalDocument } =
      athleteProfile.documents || {};

    return (
      <>
        <h2 className="text-3xl text-light-on-surface mb-4">Dados pessoais</h2>
        <p className="text-light-on-surface-variant">
          {user.name || ''} -{' '}
          {dayjs(athleteProfile?.birthDate).format('DD/MM/YYYY')}
          <br />
          {user.email || ''}
          <br />
          {user.team?.name || ''}
          <br />
          {athleteProfile?.phone || ''}
          <br />
          {athleteProfile?.country &&
            `Pais de origem: ${athleteProfile?.country}`}
        </p>

        {address && (
          <>
            <h2 className="text-3xl text-light-on-surface my-4">Endereço</h2>
            <p className="text-light-on-surface-variant">
              {address.cep || ''}
              <br />
              {address.street || ''} - {address.number || ''},{' '}
              {address.city || ''}, {address.state || ''},{' '}
              {address.country || ''}
            </p>
          </>
        )}

        {hospitalData && (
          <>
            <h2 className="text-3xl text-light-on-surface my-4">
              Dados hospitalar
            </h2>
            <p className="text-light-on-surface-variant">
              <strong>Tipo sanguíneo: </strong>
              {data?.user.athleteProfile?.hospitalData.bloodType}
              <br />
              <strong>Alergias: </strong>
              {data?.user.athleteProfile?.hospitalData.allergies}
              <br />
              <strong>Doenças crônicas: </strong>
              {data?.user.athleteProfile?.hospitalData.chronicDiseases}
              <br />
              <strong>Medicamentos regulares: </strong>
              {data?.user.athleteProfile?.hospitalData.chronicDiseases}
              <br />
            </p>
          </>
        )}

        {emergencyContact && (
          <>
            <h2 className="text-3xl text-light-on-surface my-4">
              Contato de emergência
            </h2>
            <p className="text-light-on-surface-variant">
              <strong>Nome: </strong>
              {emergencyContact.name}
              <br />
              <strong>Telefone: </strong>
              {emergencyContact.phone}
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

  const showApprovalActions =
    user?.role === Roles.ADMINCLUBE ||
    (user?.role === Roles.ADMIN && data?.approval.teamApproved) ||
    (user?.role === Roles.ADMINFEDERACAO && data?.approval.teamApproved);

  return (
    <div className="bg-light-surface p-6 rounded-2xl">
      {renderDetails()}

      <h2 className="text-3xl text-light-on-surface my-4">Aprovar ficha?</h2>
      {showApprovalActions ? (
        <div className="mt-8">
          <MultineTextfieldBare
            name="note"
            label="Observação"
            hint="Obrigatório (Obrigatório caso rejeitado)"
            onChange={e => setNote(e.target.value)}
            value={note}
          />
          <div className="col-span-1 lg:col-span-3 mt-4">
            <div className="flex flex-col-reverse lg:flex-row gap-2">
              {!isLoading && (
                <>
                  <Button
                    type="button"
                    aditionalClasses="w-auto px-20 text-light-on-surface-variant"
                    label="Voltar"
                    variant="primary-border"
                    onClick={() => navigate('/app/restrito/atletas/aprovacao')}
                  />
                  <Button
                    label="Rejeitar"
                    variant="error"
                    onClick={() => handleApprove(false)}
                  />
                  <Button
                    label="Aprovar"
                    variant="primary"
                    onClick={() => handleApprove(true)}
                  />
                </>
              )}
              {isLoading && (
                <div className="w-full flex justify-center">
                  <div className="flex flex-col items-center gap-4 text-light-on-surface-variant">
                    <CgSpinner size="2rem" className="animate-spin" />
                    <p>Carregando...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-light-on-surface-variant">
          Aguardando aprovação do clube
        </p>
      )}
    </div>
  );
}
