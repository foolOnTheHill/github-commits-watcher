import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { Redirect } from 'react-router-dom';

import Loading from './Loading';

export default class LoginRedirect extends Component {

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
			localStorage.setItem('github-app-token', JSON.stringify(data));
			this.setState({logged : true});
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
