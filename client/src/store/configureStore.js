import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';

import {
	selectRepo
} from '../actions';

const configureStore = (preloadedState) => {

	const store = createStore(
		rootReducer,
		preloadedState,
		applyMiddleware(thunkMiddleware)
	);

	store.dispatch(selectRepo('all'));

	return store;
};

export default configureStore;
