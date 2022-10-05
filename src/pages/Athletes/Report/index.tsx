import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Inputs/Button';
import { useGetAthletesReport } from '../../../dataAccess/hooks/athlete/useGetAthletesReport';

export function AthletesReportPage() {
  const navigate = useNavigate();

  const { data } = useGetAthletesReport();

  const [isLoading, setIsLoading] = useState(false);

  function defineCategory(date: string) {
    const birthDate = dayjs(date);
    const today = dayjs();
    const age = today.diff(birthDate, 'year');

    if (age < 15) {
      return 'Sub-15';
    }

    if (age < 18 && age >= 15) {
      return 'Sub-18';
    }

    if (age > 18 && age < 21) {
      return 'Sub-21';
    }

    if (age > 21) {
      return 'Adulto';
    }
  }

  function exportDataAsXLS() {
    setIsLoading(true);

    const dataToExport = data?.map(athlete => {
      const { name, email, related, document, athleteProfile } = athlete;
      const category = athlete.athleteProfile?.birthDate
        ? defineCategory(athlete.athleteProfile?.birthDate)
        : ' - ';

      return {
        Nome: name,
        Categoria: category,
        Email: email,
        CPF: document,
        Clube: related,
        'Data de Nascimento': athleteProfile?.birthDate || ' - ',
        Telefone: athleteProfile?.phone || ' - ',
        'País de Origem': athleteProfile?.country || ' - ',
        Estado: athleteProfile?.address?.state || ' - ',
        Cidade: athleteProfile?.address?.city || ' - ',
        CEP: athleteProfile?.address?.cep || ' - ',
        Endereço: athleteProfile?.address?.street || ' - ',
        Número: athleteProfile?.address?.number || ' - ',
        Complemento: athleteProfile?.address?.complement || ' - ',
        'Tipo sanguíneo': athleteProfile?.hospitalData?.bloodType || ' - ',
        Alergias: athleteProfile?.hospitalData?.allergies || ' - ',
        Medicamentos: athleteProfile?.hospitalData?.medications || ' - ',
        'Doenças crônicas':
          athleteProfile?.hospitalData?.chronicDiseases || ' - ',
        'Contato de emergência':
          athleteProfile?.emergencyContact?.name || ' - ',
        'Telefone de emergência':
          athleteProfile?.emergencyContact?.phone || ' - ',
      };
    });

    // @ts-ignore
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data1 = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    saveAs(data1, 'relatorio-atletas.xlsx');

    setIsLoading(false);
  }

  return (
    <div className="w-screen h-screen bg-light-surface-1 p-4">
      <header className="flex items-center gap-4 justify-between mb-8">
        <Button
          aditionalClasses="w-auto"
          label="Voltar para o dashboard"
          variant="primary-border"
          onClick={() => navigate('/app/dashboard')}
        />
        <h1 className="text-xl text-light-on-surface">Relatório de atletas</h1>
        <Button
          aditionalClasses="w-auto"
          label="Exportar Dados"
          onClick={() => exportDataAsXLS()}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </header>

      <table>
        <thead>
          <tr>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              Nome
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              Categoria
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              Data de nascimento
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              CPF
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              Email
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              Telefone
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              Clube
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              País de Origem
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              Estado
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              Cidade
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              CEP
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              Endereço
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              Número
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              Tipo Sanguíneo
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              Lista de alergias
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              Doenças cronicas
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              Medicamentos regulares
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              Contato de emergencia
            </th>
            <th className="p-2 border border-light-outline w-fit bg-light-tertiary-container text-light-on-tertiary-container">
              Telefone de emergencia
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map(athlete => (
            <tr key={athlete.id}>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.name}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.athleteProfile?.birthDate
                  ? defineCategory(athlete.athleteProfile?.birthDate)
                  : ' - '}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {dayjs(athlete.athleteProfile?.birthDate).format(
                  'DD/MM/YYYY',
                ) || ' - '}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.document || ' - '}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.email || ' - '}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.athleteProfile?.phone || ' - '}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.team?.name || ' - '}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.athleteProfile?.country || ' - '}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.athleteProfile?.address?.state || ' - '}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.athleteProfile?.address?.city || ' - '}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.athleteProfile?.address?.cep || ' - '}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.athleteProfile?.address?.street || ' - '}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.athleteProfile?.address?.number || ' - '}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.athleteProfile?.hospitalData?.bloodType || ' - '}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.athleteProfile?.hospitalData?.allergies || ' - '}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.athleteProfile?.hospitalData?.chronicDiseases || ' - '}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.athleteProfile?.hospitalData?.medications || ' - '}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.athleteProfile?.emergencyContact?.name || ' - '}
              </td>
              <td className="p-2 border border-light-outline w-fit">
                {athlete.athleteProfile?.emergencyContact?.phone || ' - '}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
