import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

const Navbar = ({ user, handleClick }) => {

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<a className="navbar-brand"><i className="fa fa-github"></i></a>
			<div className="collapse navbar-collapse" id="navbarText">
				<ul className="navbar-nav mr-auto">
					<li className="nav-item active">
						{user.login}
					</li>
				</ul>
				<span className="navbar-text">
					<a href="" className="nav-link" onClick={handleClick}>
						<i className="fa fa-sign-out" aria-hidden="true"></i>
						Logout
						<span className="sr-only">(current)</span>
					</a>
				</span>
			</div>
		</nav>
	);
};

export default Navbar;
