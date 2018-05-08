import { getToken } from '../utils/token';

export const LOG_OUT = 'LOG_OUT';
export const REQUEST_ADDING_REPO = 'REQUEST_ADDING_REPO';
export const FINISHED_ADDING_REPO = 'FINISHED_ADDING_REPO';
export const ERROR_ADDING_REPO = 'ERROR_ADDING_REPO';
export const SELECT_REPO = 'SELECT_REPO';
export const REQUEST_COMMITS = 'REQUEST_COMMITS';
export const RECEIVE_COMMITS = 'RECEIVE_COMMITS';
export const LOAD_ERROR = 'LOAD_ERROR';

export const logOut = () => {
	return {
		type: LOG_OUT
	};
};

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

export const requestAddRepo = (repo) => {
	return {
		type: REQUEST_ADDING_REPO,
		repo
	};
};

export const finishAddingRepo = (repo) => {
	return {
		type: FINISHED_ADDING_REPO,
		repo
	};
};

export const addError = (repo) => {
	return {
		type: ERROR_ADDING_REPO,
		repo
	};
};

export const addRepo = (repo) => {

	return (dispatch) => {

		if (repo === 'all') {
			dispatch(selectRepo(repo));
			return;
		}

		dispatch(requestAddRepo(repo));

		const token = getToken();

		const url = '/api/repositories';

		const options = {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				token,
				owner: repo.split('/')[0],
				repository: repo.split('/')[1]
			})
		};

		return fetch(url, options).then(() => {
			dispatch(fetchCommitsIfNeeded(repo));
			dispatch(selectRepo(repo));
		}).catch(error => {
			console.error(error);
			dispatch(addError(repo));
		});
	};
};
