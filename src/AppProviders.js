import React from 'react';
import App from './App';

import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import 'assets/scss/material-kit-react.scss?v=1.8.0';

import { createBrowserHistory } from 'history';

let history = createBrowserHistory();

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_COMMONS_API}/api`,
  credentials: 'include'
});

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Lato',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(',')
  }
});

const AppProviders = () => {
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <App history={history} />
      </ApolloProvider>
    </ThemeProvider>
  );
};

export { AppProviders };
