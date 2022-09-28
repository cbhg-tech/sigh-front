import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../../FirebaseConfig';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { useGlobal } from '../../../contexts/global.context';

export function PrivateRoute() {
  const location = useLocation();
  const { setIsLoggedIn } = useGlobal();
  const [authStatus, setAuthStatus] = useState<
    'logged' | 'pending' | 'unauthorized'
  >('pending');

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (!user) {
        setAuthStatus('unauthorized');
      }

      if (user) {
        setIsLoggedIn(true);
        setAuthStatus('logged');
      }
    });
  }, [setIsLoggedIn]);

  if (authStatus === 'pending') {
    return <LoadingScreen />;
  }

  if (authStatus === 'unauthorized') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
