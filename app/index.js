import 'babel-polyfill';

import React, { Fragment, useEffect } from 'react';
import { hydrate } from 'react-dom';
import { Provider as MobxProvider } from 'mobx-react';
import { createBrowserHistory, createMemoryHistory } from 'history';

// import { Helmet } from 'react-helmet';
import { renderRoutes } from 'react-router-config';

import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import styled from 'styled-components';
import { style } from './theme';

import { Switch, Route, Router, useLocation } from 'react-router-dom';
import routes from './routes';
import * as stores from './stores';
import ConfigureStartStore from './ConfigureStartStore';

import { theme } from './theme';
import { Header } from './components';
import RightPanel from './components/RightPanel';
import Footer from './components/Footer';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const Root = styled.div`display: flex;`;
const Main = styled.div`width: ${style.$leftBodyPanel};`;

export const ClientBilegoGateUi = () => {
  const history = process.env.IS_SERVER
    ? createMemoryHistory({
      initialEntries: ['/'],
    })
    : createBrowserHistory();

  // eslint-disable-next-line no-underscore-dangle
  const initialState = !process.env.IS_SERVER ? window.__INITIAL_DATA__ : {};

  const store = new ConfigureStartStore(initialState, history);
  if (!process.env.IS_SERVER) {
    window.store = store;
  }

  const routs = routes(store.baseNameForRouting);

  hydrate(
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <MobxProvider {...stores} globalStore={store}>
          <Router history={history} path={window.location.pathname}>
            <ScrollToTop />
            <Root>
              <Main>
                <Header />
                <Switch>
                  {routs.map(props => (
                    <Route {...props} />
                  ))}
                </Switch>
                <RightPanel />
              </Main>
            </Root>
            <Footer />
          </Router>
        </MobxProvider>
      </MuiThemeProvider>,
    document.getElementById('app'),
    () => {
      document.getElementById("jss-server").remove()
      // document.querySelector("style[data-styled]").remove()
    }
  );
};

export const ServerBilegoGateUi = (props) => {
  const routs = routes(props.serverBaseRout);

  return (
    <Fragment>
      <Root>
        <Main>
          <Header/>
          {renderRoutes(routs)}
          <RightPanel />
        </Main>
      </Root>
      <Footer />
    </Fragment>
  )
};
