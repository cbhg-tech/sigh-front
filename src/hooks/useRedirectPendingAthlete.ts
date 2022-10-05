import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useGlobal } from '../contexts/global.context';
import { Roles } from '../enums/Roles';
import { Status } from '../enums/Status';

export function useRedirectPendingAthlete() {
  const { user } = useGlobal();

  useEffect(() => {
    if (user?.role === Roles.USER && user?.status === Status.PENDING) {
      toast.warning('Preencha sua ficha corretamente!');
    }
  }, [user]);
}
