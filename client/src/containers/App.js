import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

import {
	addRepo,
	selectRepo,
	makeLogIn,
	logOut,
	fetchCommitsIfNeeded
} from '../actions';

import { getUser, deleteToken } from '../utils/token';

import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import Error from '../components/Error';
import AddRepo from '../components/AddRepo';
import List from '../components/List';
import SelectRepo from '../components/SelectRepo';

class App extends Component {
	constructor (props) {
		super(props);

		this.user = getUser();

		this.handleSelectEvents = this.handleSelectEvents.bind(this);
		this.handleAddEvents = this.handleAddEvents.bind(this);

		this.handleLogout = this.handleLogout.bind(this);
	}

	componentDidUpdate(prevProps) {
		const { dispatch, selectedRepo } = this.props;

		const changeSelectedRepo = this.props.selectedRepo !== prevProps.selectedRepo;
		const loadedAllRepos = !this.props.fetchingRepos && prevProps.fetchingRepos;

		if (changeSelectedRepo || loadedAllRepos) {
			dispatch(fetchCommitsIfNeeded(selectedRepo));
			dispatch(selectRepo(selectedRepo));
		}
	}

	handleLogout() {
		this.props.dispatch(logOut());
	}

	handleSelectEvents(repo) {
		this.props.dispatch(fetchCommitsIfNeeded(repo));
		this.props.dispatch(selectRepo(repo));
	}

	handleAddEvents(repo) {
		this.props.dispatch(addRepo(repo));
	}

	renderLoggedOut() {
		return <Redirect to="/" />;
	}

	renderLoginError() {
		return <Error message={'Login Error'} />;
	}

	renderLoggedIn() {
		const {
			commits,
			selectedRepo,
			isFetching,
			fetchingRepos,
			loadError,
			addingRepo,
			addingError } = this.props;

		let child;
		if (isFetching || addingRepo || fetchingRepos) {
			child = <Loading />;
		} else if (loadError) {
			child = <Error message={'Error while loading data'} />;
		} else if (addingError) {
			child = <Error message={'Error while adding repo'} />;
		} else {
			child = <List user={this.user} commits={commits} onClick={this.handleSelectEvents} />;
		}

		return (
			<div>
				<Navbar user={this.user} handleClick={this.handleLogout}/>
				<AddRepo
					value={selectedRepo}
					onClick={this.handleAddEvents} />
				<hr />
				<SelectRepo
					repositories={this.props.repositories}
					onChange={this.handleSelectEvents} />
				<hr />
				{ child }
			</div>
		);
	}

	render() {
		if (this.props.loginError) {
			return this.renderLoginError();
		} else if (this.props.loggedOut) {
			deleteToken();
			return this.renderLoggedOut();
		} else if (this.props.loggedIn) {
			return this.renderLoggedIn();
		} else {
			this.props.dispatch(makeLogIn());
			return <Loading />;
		}
	}
}

const mapStateToProps = (state) => {
	const fetchingRepos = state.fetchingRepos;
	const errorFetchingRepos = state.errorFetchingRepos;
	const repositories = state.repositories;

	const addingRepo = state.addingRepo;
	const addingError = state.addingError;
	const selectedRepo = state.selectedRepo;
	const commitsByRepo = state.commitsByRepo;

	const loggedIn = state.loggedIn;
	const loginError = state.loginError;
	const loggedOut = state.loggedOut;

	const repoCommits = commitsByRepo[selectedRepo] || { isFetching: false, loadError: false, commits: []};

	let { isFetching, loadError, commits } = repoCommits;

	return {
		fetchingRepos,
		errorFetchingRepos,
		repositories,
		loggedIn,
		loginError,
		loggedOut,
		addingRepo,
		addingError,
		selectedRepo,
		isFetching,
		loadError,
		commits
	};
};

export default connect(mapStateToProps)(App);
