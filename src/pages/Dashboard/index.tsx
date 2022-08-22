import { BiTransferAlt } from 'react-icons/bi';
import { FaUsers } from 'react-icons/fa';
import { BsFillShieldFill } from 'react-icons/bs';
import { useLogout } from '../../dataAccess/hooks/auth/useLogout';
import { ResumeCard } from './ResumeCard';

export function DashboardPage() {
  const { mutateAsync } = useLogout();

  return (
    <div className="grid gap-4 h-full grid-cols-3 grid-rows-5">
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
      <div className="bg-blue-500 col-span-3 lg:col-span-2 row-span-4">
        {/* TODO: mercado da bolinha */}
      </div>
      <div className="bg-yellow-500 hidden lg:block lg:col-span-1 row-span-4">
        {/* TODO: Ultimo atletas cadastrados */}
      </div>
    </div>
  );
}
