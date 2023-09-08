/** @format */

import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import './style.css';

const modalPortal = document.querySelector('#modal-root');

function Modal({ onClose, children }) {
	useEffect(() => {
		const onCloseModal = ({ target, key }) => {
			if (target.tagName !== 'IMG' || key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('click', onCloseModal);
		document.addEventListener('keydown', onCloseModal);

		return () => {
			document.removeEventListener('click', onCloseModal);
			document.removeEventListener('keydown', onCloseModal);
		};
	}, [onClose]);

	return createPortal(
		<div className='overlay'>
			<div className='modal'>{children}</div>
		</div>,
		modalPortal
	);
}

Modal.propTypes = {
	onClose: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
};

export default Modal;
