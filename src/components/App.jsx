import {
  Helmet as ReactHelmet,
  HelmetProvider,
} from '@dr.pogodin/react-helmet';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Redirect, Route, Switch } from 'wouter';

import useLoading, { LoadingContext } from '../hooks/use-loading';
import useUser from '../hooks/use-user';
import Account from '../routes/Account';
import Auth from '../routes/Auth';
import Log from '../routes/Log';
import LoadingScreen from '../styled/LoadingScreen';
import { today as todayFn } from '../util/dates';
import Alert, { AlertContext } from './Alert';
import ErrorBoundary from './ErrorBoundary';

export const Container = styled.div`
  margin: 0 auto;
  max-width: 30rem;
  padding: 1rem;
`;

function App() {
  const [user, userLoading, userError] = useUser();
  const [isLoading, setIsLoading] = useLoading();
  const [alert, setAlert] = useContext(AlertContext);
  const today = todayFn();

  useEffect(() => {
    setIsLoading(userLoading);
  }, [userLoading, setIsLoading]);

  useEffect(() => {
    if (userError) setAlert(['error', userError.code]);
  }, [userError, setAlert]);

  if (alert) {
    return (
      <Container>
        <Alert />
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <LoadingScreen />
      </Container>
    );
  }

  return (
    <Container>
      <Switch>
        {!user && <Route path="/auth/:action?" component={Auth} />}
        {user && <Route path="/account/:action?" component={Account} />}
        {user && <Route path="/:year/:month" component={Log} />}

        {!userLoading && (
          <Route>
            <Redirect to={user ? `/${today.year}/${today.month}` : '/auth'} />
          </Route>
        )}
      </Switch>
    </Container>
  );
}

const colorShemeDefault = window.matchMedia('(prefers-color-scheme: dark)')
  .matches
  ? 'dark'
  : 'light';

function Helmet() {
  const [alert, setAlert] = useState(null);
  const [loadingStates, setLoadingStates] = useState([]);
  const [colorScheme, setColorScheme] = useState(colorShemeDefault);

  useEffect(() => {
    const listener = (e) => {
      setColorScheme(e.matches ? 'dark' : 'light');
    };

    const match = window.matchMedia('(prefers-color-scheme: dark)');
    match.addEventListener('change', listener);
    return () => match.removeEventListener('change', listener);
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ReactHelmet>
          <meta
            name="theme-color"
            content={colorScheme === 'light' ? '#ffffff' : '#000000'}
          />
          <link
            rel="icon"
            href={`/assets/${colorScheme}/icon.png`}
            type="image/png"
          />
          <link
            rel="icon"
            href={`/assets/${colorScheme}/icon.svg`}
            type="image/svg+xml"
          />
          <link
            rel="apple-touch-icon"
            href={`/assets/${colorScheme}/apple-touch-icon.png`}
          />
          <link rel="manifest" href={`/assets/${colorScheme}/manifest.json`} />
        </ReactHelmet>
      </HelmetProvider>

      <AlertContext.Provider value={[alert, setAlert]}>
        <LoadingContext.Provider value={[loadingStates, setLoadingStates]}>
          <App />
        </LoadingContext.Provider>
      </AlertContext.Provider>
    </ErrorBoundary>
  );
}

export default Helmet;
