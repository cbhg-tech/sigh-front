import { useParams } from 'react-router-dom';
import {
  MdBarChart,
  MdCalendarToday,
  MdDescription,
  MdLink,
  MdOutlineMapsHomeWork,
  MdPhone,
} from 'react-icons/all';
import { useGetOnePartnerProject } from '../../../dataAccess/hooks/partnerProject/useGetOnePartnerProject';
import { DateService } from '../../../services/DateService';

export function PartnerProjectDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isSuccess } = useGetOnePartnerProject(id);

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      {!isLoading && isSuccess && data ? (
        <>
          <h2 className="text-3xl text-light-on-surface">{data?.name}</h2>
          <section className="mt-8 flex gap-4">
            <div>
              <MdLink size="2rem" className="text-light-on-surface" />
            </div>
            <div>
              <h3 className="text-xl text-light-on-surface">Relacionado</h3>
              <p className="text-light-on-surface-variant">
                <strong>{data?.related.name}</strong>
              </p>
            </div>
          </section>
          <section className="mt-8 flex gap-4">
            <div>
              <MdCalendarToday
                size="1.75rem"
                className="text-light-on-surface"
              />
            </div>
            <div>
              <h3 className="text-xl text-light-on-surface">Período</h3>
              <p className="text-light-on-surface-variant">
                <strong>Data de início</strong>{' '}
                {DateService().format(data!.initialDate)}
              </p>
              <p className="text-light-on-surface-variant">
                <strong>Data do fim</strong>{' '}
                {DateService().format(data!.finalDate)}
              </p>
            </div>
          </section>
          <section className="mt-8 flex gap-4">
            <div>
              <MdOutlineMapsHomeWork
                size="1.75rem"
                className="text-light-on-surface"
              />
            </div>
            <div>
              <h3 className="text-xl text-light-on-surface">Endereço</h3>
              <p className="text-light-on-surface-variant">
                {data?.address.city} - {data?.address.state}
                <br />
                {data?.address.place}
              </p>
            </div>
          </section>
          <section className="mt-8 flex gap-4">
            <div>
              <MdPhone size="1.75rem" className="text-light-on-surface" />
            </div>
            <div>
              <h3 className="text-xl text-light-on-surface">Contato</h3>
              <p className="text-light-on-surface-variant">
                <strong>{data?.contact.name}</strong> {data?.contact.phone}
              </p>
            </div>
          </section>
          <section className="mt-8 flex gap-4">
            <div>
              <MdBarChart size="1.75rem" className="text-light-on-surface" />
            </div>
            <div>
              <h3 className="text-xl text-light-on-surface">Números</h3>
              <p className="text-light-on-surface-variant">
                <strong>Faixa etária: </strong> {data?.ageGroup}
              </p>
              <p className="text-light-on-surface-variant">
                <strong>Participantes: </strong> {data?.practitioners}
              </p>
              <p className="text-light-on-surface-variant">
                <strong>Homens: </strong> {`${data?.malePractitioners}%`}
              </p>
              <p className="text-light-on-surface-variant">
                <strong>Mulheres: </strong> {`${data?.femalePractitioners}%`}
              </p>
            </div>
          </section>
          <section className="mt-8 flex gap-4">
            <div>
              <MdDescription size="1.75rem" className="text-light-on-surface" />
            </div>
            <div>
              <h3 className="text-xl text-light-on-surface">Descrição</h3>
              <p>{data?.description}</p>
            </div>
          </section>
        </>
      ) : (
        <div>
          <h2 className="text-3xl text-light-on-surface-variant">
            Carregando...
          </h2>
        </div>
      )}
    </div>
  );
}
