import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

const Error = ({ message }) => {
	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-8">
					<div className="alert alert-danger" role="alert">
						<b>Error:</b> {message}
					</div>
				</div>
			</div>
		</div>
	);
};

Error.propTypes = {
	message: PropTypes.string.isRequired
};

export default Error;
