import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';

import Login from '../components/Login';
import LoginRedirect from '../components/LoginRedirect';

import App from './App';

export default class Root extends Component {
	render() {
		return (
			<Provider store={this.props.store}>
				<div>
					<Route exact path="/" component={Login} />
					<Route exact path="/login/redirect" component={LoginRedirect} />
					<Route exact path="/app" component={App} />
				</div>
			</Provider>
		);
	}
}
