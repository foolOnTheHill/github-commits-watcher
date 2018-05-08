import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

export default class Login extends Component {

	componentWillMount() {
		localStorage.removeItem('github-app-token');
	}

	render() {
		return (
			<div className="jumbotron">
				<h4 className="display-4 text-center">GitHub Commits Watcher</h4>
				<p className="lead text-center">Quickly list your repositories commits!</p>
				<hr className="my-4" />
				<a href="/auth"><button className="btn btn-primary text-center">Login</button></a>
			</div>
		);
	}

}
