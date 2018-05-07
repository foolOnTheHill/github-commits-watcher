import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
	selectRepo,
	fetchCommitsIfNeeded
} from '../actions';

import Header from '../components/Header';
import Loading from '../components/Loading';
import Error from '../components/Error';

import AddRepo from '../components/AddRepo';
import List from '../components/List';

class App extends Component {
	constructor (props) {
		super(props);

		this.handleEvents = this.handleEvents.bind(this);
	}

	componentDidMount() {
		const { dispatch, selectedRepo } = this.props;

		dispatch(selectRepo(selectedRepo));
		dispatch(fetchCommitsIfNeeded(selectedRepo));
	}

	componentDidUpdate(prevProps) {
		if (this.props.selectedRepo !== prevProps.selectedRepo) {
			const { dispatch, selectedRepo } = this.props;

			dispatch(fetchCommitsIfNeeded(selectedRepo));
		}
	}

	handleEvents(repo) {
		this.props.dispatch(selectRepo(repo));
		this.props.dispatch(fetchCommitsIfNeeded(repo));
	}

	render() {
		const { commits, selectedRepo, isFetching, loadError } = this.props;

		let child;
		if (isFetching) {
			child = <Loading />;
		} else if (loadError) {
			child = <Error message={'Error while loading data'} />;
		} else {
			child = <List commits={commits} onClick={this.handleEvents} />;
		}

		return (
			<div>
				<Header />
				<AddRepo
					value={selectedRepo}
					onChange={this.handleEvents} />
				<hr />
				{ child }
			</div>
		);
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
	const selectedRepo = state.selectedRepo;
	const commitsByRepo = state.commitsByRepo;

	const repoCommits = commitsByRepo[selectedRepo] || { isFetching: false, commits: []};

	let { isFetching, loadError, commits } = repoCommits;

	return {
		selectedRepo,
		isFetching,
		loadError,
		commits
	};
};

export default connect(mapStateToProps)(App);
