import { BiTransferAlt } from 'react-icons/bi';
import { FaUsers } from 'react-icons/fa';
import { BsFillShieldFill } from 'react-icons/bs';
import { ResumeCard } from './ResumeCard';
import { BallMarketCard } from './BallMarketCard';
import { UserCard } from './UserCard';
import { useRedirectPendingAthlete } from '../../hooks/useRedirectPendingAthlete';

export function DashboardPage() {
  useRedirectPendingAthlete();

  return (
    <div className="grid gap-4 h-full max-h-full grid-cols-3 grid-rows-[164px_1fr]">
      <div className="col-span-3 row-span-1 flex flex-nowrap gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory">
        <ResumeCard icon={FaUsers} title="Total de atletas" value={1000} />
        <ResumeCard
          icon={BiTransferAlt}
          title="Transferencias no ano"
          value={200}
        />
        <ResumeCard
          icon={BsFillShieldFill}
          title="Total de clubes"
          value={23}
        />
      </div>
      <div className="col-span-3 lg:col-span-2 row-span-4 overflow-y-auto">
        <h2 className="text-3xl text-light-on-surface mb-4">
          Mercado da bolinha
        </h2>
        <BallMarketCard />
        <BallMarketCard />
        <BallMarketCard />
      </div>
      <div className="bg-light-surface rounded-2xl hidden lg:block lg:col-span-1 row-span-4 p-6">
        <h2 className="text-3xl text-light-on-surface mb-4">
          Últimos cadastros
        </h2>
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
      </div>
    </div>
  );
}
