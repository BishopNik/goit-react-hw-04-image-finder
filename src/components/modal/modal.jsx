/** @format */

import { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import './style.css';

const modalPortal = document.querySelector('#modal-root');

class Modal extends Component {
	static propTypes = {
		onClose: PropTypes.func.isRequired,
		children: PropTypes.node.isRequired,
	};

	componentDidMount = () => {
		document.addEventListener('click', this.onCloseModal);
		document.addEventListener('keydown', this.onCloseModal);
	};

	componentWillUnmount = () => {
		document.removeEventListener('click', this.onCloseModal);
		document.removeEventListener('keydown', this.onCloseModal);
	};

	onCloseModal = ({ target, key }) => {
		if (target.tagName !== 'IMG' || key === 'Escape') {
			this.props.onClose();
		}
	};

	render() {
		return createPortal(
			<div className='overlay'>
				<div className='modal'>{this.props.children}</div>
			</div>,
			modalPortal
		);
	}
}

export default Modal;
