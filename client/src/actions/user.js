import { loadRepos } from './repositories';

export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';

const logIn = () => {
	return {
		type: LOG_IN
	};
};

export const makeLogIn = () => {
	return (dispatch) => {
		dispatch(logIn());
		dispatch(loadRepos());
	};
};

export const logOut = () => {
	return {
		type: LOG_OUT
	};
};
