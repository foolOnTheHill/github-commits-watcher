import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
// import PropTypes from 'prop-types';

export default class SelectRepo extends Component {

	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.props.onChange(event.target.value);
	}

	render() {
		const options = this.props.repositories.map(repo => {
			const repoFullName = `${repo.owner.login}/${repo.name}`;

			return (
				<option value={repoFullName}>
					<a className="form-control">{repo.name}</a>
				</option>
			);
		});

		return (
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-8">
						<div classname="input-group mb-3">
							<p>Select a repository:</p>

							<select onChange={this.handleChange} className="custom-select" htmlId="selectRepos">
								<option disabled>
									<a className="form-control">Select a repository</a>
								</option>
								<option value={'all'} selected>
									<a className="form-control">All</a>
								</option>
								{options}
							</select>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
