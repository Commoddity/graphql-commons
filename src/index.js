import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import { AppProviders } from './ApolloProvider';

axios.defaults.withCredentials = true;

ReactDOM.render(<AppProviders />, document.getElementById('root'));
