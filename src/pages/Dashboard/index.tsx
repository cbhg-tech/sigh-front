import { BiTransferAlt } from 'react-icons/bi';
import { FaUsers } from 'react-icons/fa';
import { BsFillShieldFill } from 'react-icons/bs';
import { ResumeCard } from './ResumeCard';
import { BallMarketCard } from './BallMarketCard';
import { UserCard } from './UserCard';
import { useRedirectPendingAthlete } from '../../hooks/useRedirectPendingAthlete';
import { useGetDashboardTotalizer } from '../../dataAccess/hooks/dashboard/useGetDashboardTotalizer';
import { useGetDashboardLatestTransfer } from '../../dataAccess/hooks/dashboard/useGetDashboardLastestTransfers';
import { useGetDashboardLatestAthletes } from '../../dataAccess/hooks/dashboard/useGetDashboardLatestAthletes';

export function DashboardPage() {
  useRedirectPendingAthlete();
  const { data: totalizerData } = useGetDashboardTotalizer();
  const { data: transfersData, isLoading } = useGetDashboardLatestTransfer();
  const { data: athletesData } = useGetDashboardLatestAthletes();

  return (
    <div className="grid gap-4 h-full max-h-full grid-cols-3 grid-rows-[164px_1fr]">
      <div className="col-span-3 row-span-1 flex flex-nowrap gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory">
        <ResumeCard
          icon={FaUsers}
          title="Total de atletas"
          value={totalizerData?.totalAthletes || 0}
        />
        <ResumeCard
          icon={BiTransferAlt}
          title="Transferencias no ano"
          value={totalizerData?.totalTransfers || 0}
        />
        <ResumeCard
          icon={BsFillShieldFill}
          title="Total de clubes"
          value={totalizerData?.totalTeams || 0}
        />
      </div>
      <div className="col-span-3 lg:col-span-2 row-span-4 overflow-y-auto">
        <h2 className="text-3xl text-light-on-surface mb-4">
          Mercado da bolinha
        </h2>
        {isLoading && (
          <p className="text-center text-light-on-surface-variant">
            Carregando mercado da bolinha
          </p>
        )}

        {!isLoading && transfersData && transfersData.length === 0 && (
          <p className="text-center text-light-on-surface-variant mt-10">
            Nenhuma transferencia localizada
          </p>
        )}

        {!isLoading &&
          transfersData &&
          transfersData?.length > 0 &&
          transfersData.map(transfer => <BallMarketCard transfer={transfer} />)}
      </div>
      <div className="bg-light-surface rounded-2xl hidden lg:block lg:col-span-1 row-span-4 p-6">
        <h2 className="text-3xl text-light-on-surface mb-4">
          Últimos cadastros
        </h2>
        {athletesData && athletesData.length === 0 && (
          <p className="text-center text-light-on-surface-variant">
            Nenhum atleta localizado
          </p>
        )}
        {athletesData &&
          athletesData.map(athlete => <UserCard user={athlete} />)}
      </div>
    </div>
  );
}
