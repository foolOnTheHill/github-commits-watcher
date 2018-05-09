import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Loading from './Loading';

import { logIn } from '../actions';

import { TOKEN_LOCATION } from '../config';

class LoginRedirect extends Component {

	constructor(props) {
		super(props);

		this.state = {
			logged : false
		};
	}

	componentDidMount() {
		const params = new URLSearchParams(this.props.location.search);

		const body = {
			code: params.get('code'),
			state: params.get('state')
		};

		fetch('/auth', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}).then(res => {
			return res.json();
		}).then(data => {
			this.props.dispatch(logIn());
			localStorage.setItem(TOKEN_LOCATION, JSON.stringify(data));
			this.setState({logged: true});
		});
	}

	render() {
		if (this.state.logged) {	
			return <Redirect to="/app" />;
		} else {
			return <Loading />;
		}
	}

}

const mapStateToProps = (state) => {
	return {
		loggedIn: state.loggedIn
	};
};

export default connect(mapStateToProps)(LoginRedirect);
