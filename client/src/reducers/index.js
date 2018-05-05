import {
	SELECT_REPO,
	RECEIVE_COMMITS,
	REQUEST_COMMITS,
	LOAD_ERROR
} from '../actions';

const initialState = {
	selectedRepo: 'all',
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
	default:
		return state;
	}
};

export default rootReducer;
