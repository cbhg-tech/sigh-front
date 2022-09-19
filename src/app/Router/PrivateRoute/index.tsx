import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../../FirebaseConfig';
import { LoadingScreen } from '../../../components/LoadingScreen';

export function PrivateRoute() {
  const location = useLocation();
  const [authStatus, setAuthStatus] = useState<
    'logged' | 'pending' | 'unauthorized'
  >('pending');

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (!user) {
        setAuthStatus('unauthorized');
      }

      if (user) {
        setAuthStatus('logged');
      }
    });
  }, []);

  if (authStatus === 'pending') {
    return <LoadingScreen />;
  }

  if (authStatus === 'unauthorized') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
