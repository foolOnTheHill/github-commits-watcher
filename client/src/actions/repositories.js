import { getToken } from '../utils/token';

import { fetchCommitsIfNeeded } from './commits';

export const SELECT_REPO = 'SELECT_REPO';
export const REQUEST_ADDING_REPO = 'REQUEST_ADDING_REPO';
export const FINISHED_ADDING_REPO = 'FINISHED_ADDING_REPO';
export const ERROR_ADDING_REPO = 'ERROR_ADDING_REPO';

export const FETCHING_REPOS = 'FETCHING_REPOS';
export const RECEIVE_REPOS = 'RECEIVE_REPOS';
export const ERROR_RECEIVING_REPOS = 'ERROR_RECEIVING_REPOS';

export const fetchingRepos = () => {
	return {
		type: FETCHING_REPOS
	};
};

export const receiveRepos = (repos) => {
	return {
		type: RECEIVE_REPOS,
		repos
	};
};

export const errorFetchingRepos = () => {
	return {
		type: ERROR_RECEIVING_REPOS
	};
};

export const loadRepos = () => {
	return (dispatch) => {
		dispatch(fetchingRepos());

		const token = getToken();

		const url = `/api/repositories?token=${token}`;

		return fetch(url).then(data => data.json()).then(repositories => {
			dispatch(receiveRepos(repositories));
		}).catch(error => {
			console.error(error);
			dispatch(errorFetchingRepos());
		});
	};
};

export const selectRepo = (repo) => {
	return {
		type: SELECT_REPO,
		repo
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
			dispatch(finishAddingRepo(repo));
			dispatch(fetchCommitsIfNeeded(repo));
			dispatch(loadRepos());
			dispatch(selectRepo(repo));
		}).catch(error => {
			console.error(error);
			dispatch(addError(repo));
		});
	};
};
