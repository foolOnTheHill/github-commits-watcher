import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

const Navbar = ({ user, handleClick }) => {

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<a className="navbar-brand">GitHub Commits Watcher</a>
			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>
			<div className="collapse navbar-collapse" id="navbarText">
				<ul className="navbar-nav mr-auto">
					<li className="nav-item active">
						{`${user.login} - (${user.name} / ${user.email})`}
					</li>
				</ul>
				<span className="navbar-text">
					<a className="nav-link" onClick={handleClick}>Logout <span className="sr-only">(current)</span></a>
				</span>
			</div>
		</nav>
	);
};

export default Navbar;
