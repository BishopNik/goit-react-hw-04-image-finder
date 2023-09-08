/** @format */

import PropTypes from 'prop-types';

export const ErrorComponent = ({ className, children }) => {
	return <h2 className={`error-found ${className}`}>{children}</h2>;
};

ErrorComponent.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
};
