import { BiTransferAlt } from 'react-icons/bi';
import { FaUsers } from 'react-icons/fa';
import { BsFillShieldFill } from 'react-icons/bs';
import { ResumeCard } from './ResumeCard';
import { BallMarketCard } from './BallMarketCard';
import { useRedirectPendingAthlete } from '../../hooks/useRedirectPendingAthlete';
import { useGetDashboardTotalizer } from '../../dataAccess/hooks/dashboard/useGetDashboardTotalizer';
import { useGetDashboardLatestTransfer } from '../../dataAccess/hooks/dashboard/useGetDashboardLastestTransfers';

export function DashboardPage() {
  useRedirectPendingAthlete();
  const { data: totalizerData } = useGetDashboardTotalizer();
  const { data: transfersData, isLoading } = useGetDashboardLatestTransfer();

  return (
    <div className="flex flex-col gap-4 h-full max-h-full">
      <div className="flex flex-nowrap gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory">
        <ResumeCard
          icon={FaUsers}
          title="Total de atletas"
          value={totalizerData?.athletes || 0}
        />
        <ResumeCard
          icon={BiTransferAlt}
          title="Transferencias no ano"
          value={totalizerData?.transfers || 0}
        />
        <ResumeCard
          icon={BsFillShieldFill}
          title="Total de clubes"
          value={totalizerData?.teams || 0}
        />
      </div>
      <div className="overflow-y-auto bg-light-surface-1">
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
    </div>
  );
}
