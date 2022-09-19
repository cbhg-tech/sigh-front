import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '../../FirebaseConfig';
import { useGlobal } from '../../../contexts/global.context';

export function PrivateRoute() {
  const location = useLocation();
  const { isLoggedIn, setIsLoggedIn } = useGlobal();

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (!user && isLoggedIn) {
        setIsLoggedIn(false);
      }

      if (user && !isLoggedIn) {
        setIsLoggedIn(true);
      }
    });
  }, [isLoggedIn, setIsLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/app/dashboard" state={{ from: location }} replace />
  );
}
