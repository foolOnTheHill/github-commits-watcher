import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

const Commit = ({ commit, onClick }) => {
	let { hash, message, author, date, repository } = commit;

	const handleClick = () => {
		onClick(repository.name);
	};

	return (
		<div className="card">
			<div className="card-body">
				<h6 className="card-subtitle mb-2 text-muted">{author} - {date}</h6>
				<p className="card-text">{ message }</p>
				<a className="card-link">{ hash }</a>
				<a clasNames="card-link" onClick={handleClick}>{ repository.name }</a>
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
