import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useGlobal } from '../../../contexts/global.context';

export function PrivateRoute() {
  const location = useLocation();
  const { token } = useGlobal();

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
