import { Button } from '../../components/Inputs/Button';
import { useLogout } from '../../dataAccess/hooks/auth/useLogout';

export function DashboardPage() {
  const { mutateAsync } = useLogout();

  return (
    <div>
      <h1>Hello World, Dashboard</h1>
      <Button label="Logout" onClick={() => mutateAsync()} />
    </div>
  );
}
