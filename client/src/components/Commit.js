import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

import * as moment from 'moment';

const Commit = ({ login, commit, onClick }) => {

	let { message, author, date, repository } = commit;

	const handleClick = () => {
		const repoFullName = `${login}/${repository.name}`;

		onClick(repoFullName);
	};

	const prettyDate = moment(date).format('L');

	return (
		<div>
			<br />
			<div className="card">
				<div className="card-header">
					{prettyDate}
				</div>
				<div className="card-body">
					<h5 className="card-title">{author}</h5>
					<p className="card-text">{message}</p>
					<a className="btn btn-primary" onClick={handleClick}>{repository.name}</a>
				</div>
			</div>
		</div>
	);
};

Commit.propTypes = {
	commit: PropTypes.shape({
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
	}).isRequired,
	onClick : PropTypes.func.isRequired
};

export default Commit;
