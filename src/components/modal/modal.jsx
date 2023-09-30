/** @format */

import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import './style.css';

const modalPortal = document.querySelector('#modal-root');

function Modal({ onClose, children }) {
	const onCloseModal = ({ target, key }) => {
		if (target.tagName !== 'IMG' || key === 'Escape') {
			onClose();
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', onCloseModal);

		return () => {
			document.removeEventListener('keydown', onCloseModal);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onClose]);

	return createPortal(
		<div className='overlay' onClick={onCloseModal}>
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
