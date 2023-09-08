/** @format */

import { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';

class ImageItem extends Component {
	static propTypes = {
		srcUrl: PropTypes.string.isRequired,
		tags: PropTypes.string.isRequired,
		dataset: PropTypes.string.isRequired,
		onClick: PropTypes.func.isRequired,
	};

	render() {
		return (
			<li className='gallery-item' onClick={this.props.onClick}>
				<img
					className='gallery-img'
					src={this.props.srcUrl}
					alt={this.props.tags}
					data-largeurl={this.props.dataset}
				/>
			</li>
		);
	}
}

export default ImageItem;
