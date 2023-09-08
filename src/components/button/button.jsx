/** @format */

import { Component } from 'react';
import PropTypes from 'prop-types';

class Button extends Component {
	static propTypes = {
		class: PropTypes.string,
		type: PropTypes.string.isRequired,
		children: PropTypes.node.isRequired,
	};

	render() {
		const { className, type, onClick, children } = this.props;
		return (
			<button className={className} type={type} onClick={onClick}>
				{children}
			</button>
		);
	}
}

export default Button;
