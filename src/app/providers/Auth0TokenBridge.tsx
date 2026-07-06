import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { setAuthTokenGetter } from '@/lib';

export function Auth0TokenBridge({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      setAuthTokenGetter(getAccessTokenSilently);
    } else {
      setAuthTokenGetter(null);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return <>{children}</>;
}
