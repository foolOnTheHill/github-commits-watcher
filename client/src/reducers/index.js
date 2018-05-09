import {
	LOG_IN,
	LOG_OUT,
	SELECT_REPO,
	RECEIVE_COMMITS,
	REQUEST_COMMITS,
	LOAD_ERROR,
	REQUEST_ADDING_REPO,
	FINISHED_ADDING_REPO,
	ERROR_ADDING_REPO,
	FETCHING_REPOS,
	RECEIVE_REPOS,
	ERROR_RECEIVING_REPOS
} from '../actions';

const initialState = {
	loggedIn: false,
	addingRepo: false,
	addingError: false,
	fetchingRepos: false,
	errorFetchingRepos: false,
	selectedRepo: 'all',
	repositories: [],
	commitsByRepo: {
		all: {
			isFetching: false,
			loadError: false,
			commits: []
		}
	}
};

const commits = (
	state = {
		isFetching: false,
		loadError: false,
		commits: []
	},
	action
) => {
	switch (action.type) {
	case REQUEST_COMMITS:
		return Object.assign({}, state, {
			isFetching: true
		});
	case LOAD_ERROR:
		return Object.assign({}, state, {
			isFetching: false,
			loadError: true
		});
	case RECEIVE_COMMITS:
		return Object.assign({}, state, {
			isFetching: false,
			loadError: false,
			commits: action.commits
		});
	default:
		return state;
	}
};

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
	case FETCHING_REPOS:
		return Object.assign({}, state, {
			fetchingRepos: true
		});
	case RECEIVE_REPOS:
		return Object.assign({}, state, {
			fetchingRepos: false,
			repositories: action.repos
		});
	case ERROR_RECEIVING_REPOS:
		return Object.assign({}, state, {
			errorFetchingRepos: true
		});
	case LOAD_ERROR:
	case REQUEST_COMMITS:
	case RECEIVE_COMMITS:
		return Object.assign({}, state, {
			commitsByRepo: Object.assign({}, state.commitsByRepo, {
				[action.repo] : commits(state.commitsByRepo[action.repo], action)
			})
		});
	case SELECT_REPO:
		return Object.assign({}, state, {
			selectedRepo: action.repo
		});
	case REQUEST_ADDING_REPO:
		return Object.assign({}, state, {
			addingRepo: true
		});
	case FINISHED_ADDING_REPO:
		return Object.assign({}, state, {
			addingRepo: false,
			addingError: false
		});
	case ERROR_ADDING_REPO:
		return Object.assign({}, state, {
			addingError: true
		});
	case LOG_IN:
		return Object.assign({}, state, {
			loggedIn: true
		});
	case LOG_OUT:
		return Object.assign({}, state, initialState);
	default:
		return state;
	}
};

export default rootReducer;
