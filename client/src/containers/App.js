import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

import {
	addRepo,
	selectRepo,
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

	componentDidMount() {
		const { dispatch, selectedRepo } = this.props;

		dispatch(fetchCommitsIfNeeded(selectedRepo));
		dispatch(selectRepo(selectedRepo));
	}

	componentDidUpdate(prevProps) {
		if (this.props.selectedRepo !== prevProps.selectedRepo) {
			const { dispatch, selectedRepo } = this.props;

			dispatch(fetchCommitsIfNeeded(selectedRepo));
			dispatch(selectRepo(selectedRepo));
		}
	}

	handleLogout() {
		deleteToken();
		this.props.dispatch(logOut());
	}

	handleSelectEvents(repo) {
		this.props.dispatch(fetchCommitsIfNeeded(repo));
		this.props.dispatch(selectRepo(repo));
	}

	handleAddEvents(repo) {
		this.props.dispatch(addRepo(repo));
	}

	renderLoggedIn() {
		const { commits, selectedRepo, isFetching, loadError, addingRepo, addingError } = this.props;

		let child;
		if (isFetching || addingRepo) {
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

	renderRedirect() {
		return <Redirect to="/" />;
	}

	render() {
		if (this.props.loggedIn) {
			return this.renderLoggedIn();
		} else {
			return this.renderRedirect();
		}
	}
}

App.propTypes = {
	isFetching : PropTypes.bool.isRequired,
	commits: PropTypes.arrayOf(PropTypes.shape({
		hash: PropTypes.string.isRequired,
		message: PropTypes.string.isRequired,
		author: PropTypes.string.isRequired,
		date: PropTypes.string.isRequired,
		repository: PropTypes.shape({
			name: PropTypes.string.isRequired,
			description: PropTypes.string.isRequired,
			created_date: PropTypes.string.isRequired,
			owner: PropTypes.string.isRequired
		})
	})).isRequired
};

const mapStateToProps = (state) => {
	const fetchingRepos = state.fetchingRepos;
	const errorFetchingRepos = state.errorFetchingRepos;
	const repositories = state.repositories;

	const addingRepo = state.addingRepo;
	const addingError = state.addingError;
	const selectedRepo = state.selectedRepo;
	const commitsByRepo = state.commitsByRepo;

	const loggedIn = state.loggedIn;

	const repoCommits = commitsByRepo[selectedRepo] || { isFetching: false, loadError: false, commits: []};

	let { isFetching, loadError, commits } = repoCommits;

	return {
		fetchingRepos,
		errorFetchingRepos,
		repositories,
		loggedIn,
		addingRepo,
		addingError,
		selectedRepo,
		isFetching,
		loadError,
		commits
	};
};

export default connect(mapStateToProps)(App);
