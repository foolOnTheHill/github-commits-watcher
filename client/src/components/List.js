import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import Commit from './Commit';

const List = ({ commits, onClick }) => {
	const commitComponentsList = commits.map(commit => {
		return (
			<li>
				<Commit commit={commit} onClick={onClick}/>
			</li>
		);
	});

	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-8">
					<ul className="list-group">
						{ commitComponentsList }
					</ul>
				</div>
			</div>
		</div>
	);
};

List.propTypes = {
	commits: PropTypes.arrayOf(PropTypes.shape({
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
	})).isRequired,
	onClick: PropTypes.func.isRequired
};

export default List;
