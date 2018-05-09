import { getToken } from '../utils/token';

export const REQUEST_COMMITS = 'REQUEST_COMMITS';
export const RECEIVE_COMMITS = 'RECEIVE_COMMITS';
export const LOAD_ERROR = 'LOAD_ERROR';

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

		const token = getToken();

		let endpoint;

		let repoId = repo;

		if (repo !== 'all') {
			repoId = repo.split('/')[1];
			endpoint = `repositories/${repoId}/commits`;
		} else {
			endpoint = 'commits';
		}

		const url = `/api/${endpoint}?token=${token}`;

		return fetch(url).then(data => data.json()).then(commits => {
			dispatch(receiveCommits(repo, commits));
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
