/** @format */

import { createPortal } from 'react-dom';
import { ColorRing } from 'react-loader-spinner';
import './style.css';

const loaderPortal = document.querySelector('#modal-root');
function Loader() {
	return createPortal(
		<div className='overlay'>
			<div className='loading-container'>
				{/* <span className='loading'></span> */}
				<ColorRing
					visible={true}
					height='240'
					width='240'
					ariaLabel='blocks-loading'
					wrapperStyle={{}}
					wrapperClass='blocks-wrapper'
					colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
				/>
			</div>
		</div>,
		loaderPortal
	);
}

export default Loader;
