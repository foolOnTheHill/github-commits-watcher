import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

export default class AddRepo extends Component {

	constructor(props) {
		super(props);

		this.handleGoClick = this.handleGoClick.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value !== this.props.value) {
			this.setInputValue(nextProps.value);
		}
	}

	getInputValue() {
		return this.input.value;
	}

	setInputValue(val) {
		this.input.value = val;
	}

	handleKeyUp(e) {
		if (e.keyCode === 13) {
			this.handleGoClick();
		}
	}

	handleGoClick() {
		this.props.onChange(this.getInputValue());
	}

	render() {
		return (
			<div>
				<p>Type a repo full name and hit 'Go':</p>

				<div>
					<div className="form-group">
						<input
							type="text"
							className="form-control"
							placeholder="reactjs/redux"
							ref={(input) => this.input = input}
							defaultValue={this.props.value}
							onKeyUp={this.handleKeyUp} />
					</div>
					<button className="btn btn-primary" onClick={this.handleGoClick}>Add</button>
				</div>
			</div>
		);
	}
}

AddRepo.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
};
