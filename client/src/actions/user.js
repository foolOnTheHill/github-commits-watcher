import { loadRepos } from './repositories';

export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';

export const logIn = () => {
	return (dispatch) => {
		dispatch(loadRepos());

		return {
			type: LOG_IN
		};
	};
};

export const logOut = () => {
	return {
		type: LOG_OUT
	};
};
