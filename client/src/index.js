import 'bootstrap/dist/css/bootstrap.css';

import React from 'react'; // eslint-disable-line no-unused-vars
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Root from './containers/Root';
import configureStore from './store/configureStore';

const store = configureStore();

render(
	<Router>
		<Root store={store} />
	</Router>,
	document.getElementById('root')
);
