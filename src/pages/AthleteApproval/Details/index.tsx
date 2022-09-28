import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useState } from 'react';
import { MdCheck, MdOpenInNew } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useGetAppovalDetails } from '../../../dataAccess/hooks/athlete/useGetApprovalDetails';
import { MultineTextfieldBare } from '../../../components/Inputs/MultilineTextfieldBare';
import { Button } from '../../../components/Inputs/Button';
import { useUpdateApprovalStatus } from '../../../dataAccess/hooks/athlete/useUpdateApprovalStatus';
import { useGlobal } from '../../../contexts/global.context';
import { Roles } from '../../../enums/Roles';
import { Status } from '../../../enums/Status';

export function ApprovalDetailsPage() {
  const { id } = useParams();
  const { user } = useGlobal();

  const { data } = useGetAppovalDetails(id);
  const { mutateAsync, isLoading } = useUpdateApprovalStatus();

  const [isApproved, setIsApproved] = useState(false);
  const [note, setNote] = useState('');

  const handleApprove = async () => {
    const approvalData = data?.approval;

    if (!approvalData) throw new Error('Approval data not found');

    try {
      if (!isApproved && !note)
        throw new Error('Por favor adicione uma observação');

      if (
        user?.role !== Roles.ADMINCLUBE &&
        user?.role !== Roles.ADMINFEDERACAO
      )
        throw new Error('Você não tem permissão para aprovar');

      if (isApproved) {
        if (user?.role === Roles.ADMINCLUBE) approvalData.teamApproved = true;

        if (
          (approvalData.teamApproved && user?.role === Roles.ADMINCLUBE) ||
          user?.role === Roles.ADMINFEDERACAO
        )
          approvalData.cbhgApproved = true;

        if (approvalData.cbhgApproved && approvalData.teamApproved)
          approvalData.status = Status.ACTIVE;
      } else {
        approvalData.status = Status.INACTIVE;

        // TODO: nao salvou log
        if (!approvalData.log || approvalData.log?.length === 0) {
          approvalData.log = [
            {
              updatedAt: new Date(),
              note,
            },
          ];
        } else if (approvalData.log && approvalData.log.length > 0) {
          approvalData.log.push({
            updatedAt: new Date(),
            note,
          });
        }
      }

      await mutateAsync({ ...approvalData });
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
          {user.team || ''}
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

        <h2 className="text-3xl text-light-on-surface my-4">Documentos</h2>
        <p className="text-light-on-surface-variant">
          {personalDocument && (
            <>
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
    <div className="bg-light-surface p-6 rounded-2xl">
      {renderDetails()}

      <div className="mt-8">
        <label
          htmlFor="approved"
          className="mb-4 text-light-on-surface flex items-center gap-2 relative"
        >
          <input
            id="approved"
            type="checkbox"
            className="peer appearance-none w-6 h-6 border-2 border-light-outline rounded bg-light-surface checked:border-light-tertiary hover:brightness-90"
            onChange={e => setIsApproved(e.target.checked)}
          />
          <div className="invisible grid place-items-center peer-checked:visible w-4 h-4 rounded-sm absolute bg-light-tertiary top-1 left-1">
            <MdCheck size="1rem" className="text-light-on-tertiary" />
          </div>
          Aprovar pela CBHG?
        </label>
        <MultineTextfieldBare
          name="note"
          label="Observação"
          hint="Obrigatório (Obrigatório caso rejeitado)"
          onChange={e => setNote(e.target.value)}
          value={note}
        />
        <div className="col-span-1 lg:col-span-3 mt-4">
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              aditionalClasses="w-auto px-2 text-light-on-surface-variant"
              label="Cancelar"
              variant="primary-border"
            />
            <Button
              type="button"
              aditionalClasses="w-auto px-2"
              label="Salvar"
              variant="primary"
              isLoading={isLoading}
              onClick={handleApprove}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
