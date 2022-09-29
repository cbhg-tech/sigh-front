import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../contexts/global.context';
import { Roles } from '../enums/Roles';
import { Status } from '../enums/Status';

export function useRedirectPendingAthlete() {
  const navigate = useNavigate();
  const { user } = useGlobal();

  useEffect(() => {
    if (user?.role === Roles.USER && user?.status === Status.PENDING) {
      navigate('/app/perfil');
    }
  }, [navigate, user]);
}
