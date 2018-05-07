export const SELECT_REPO = 'SELECT_REPO';
export const REQUEST_COMMITS = 'REQUEST_COMMITS';
export const RECEIVE_COMMITS = 'RECEIVE_COMMITS';
export const LOAD_ERROR = 'LOAD_ERROR';

export const selectRepo = (repo) => {
	return {
		type: SELECT_REPO,
		repo
	};
};

const requestCommits = (repo='all') => {
	return {
		type: REQUEST_COMMITS,
		repo
	};
};

const receiveCommits = (repo = 'all', commits) => {
	return {
		type: RECEIVE_COMMITS,
		repo,
		commits
	};
};

const loadError = (repo = 'all') => {
	return {
		type: LOAD_ERROR,
		repo
	};
};

const fetchCommits = (repo = 'all') => {
	return (dispatch) => {

		dispatch(requestCommits(repo));

		let endpoint;

		if (repo !== 'all') {
			endpoint = `/repositories/${repo}/commits`;
		} else {
			endpoint = '/commits';
		}

		const url = endpoint;

		return fetch(url).then(response => response.json()).then(data => {
			dispatch(receiveCommits(repo, data));
		}).catch(error => {
			console.error(error);
			dispatch(loadError(repo));
		});
	};
};

const shouldFetchCommits = (state, repo = 'all') => {
	const commits = state.commitsByRepo[repo];

	return !commits || !commits.isFetching;
};

export const fetchCommitsIfNeeded = (repo = 'all') => {
	return (dispatch, getState) => {
		if (shouldFetchCommits(getState(), repo)) {
			return dispatch(fetchCommits(repo));
		} else {
			return Promise.resolve();
		}
	};
};
