/** @format */

import { useState } from 'react';
import PropTypes from 'prop-types';
import Searchbar from './searchbar';
import ImageGallery from './gallery';
import Modal from './modal';

import './style.css';

function App() {
	const [searchItem, setSearchItem] = useState('');
	const [isModalShow, setIsModalShow] = useState(false);
	const [isNewSearch, setIsNewSearch] = useState(false);
	const [bigImgShow, setBigImgShow] = useState('');

	const handlerChangeSearchValue = value => {
		setSearchItem(value);
		setIsNewSearch(true);
	};

	const handlerSearchComplete = value => {
		setIsNewSearch(false);
	};

	const handleClick = bigImageSrc => {
		setIsModalShow(true);
		setBigImgShow(bigImageSrc);
	};

	const handlerCloseModal = () => {
		setIsModalShow(false);
	};

	return (
		<div className='container'>
			{isModalShow && (
				<Modal onClose={handlerCloseModal}>
					<img src={bigImgShow} alt='Big Search Element' />
				</Modal>
			)}
			<Searchbar handlerSearch={handlerChangeSearchValue} />
			<ImageGallery
				searchItem={searchItem}
				isNewSearch={isNewSearch}
				onClickBigImage={handleClick}
				onSearchCompeted={handlerSearchComplete}
			/>
		</div>
	);
}

App.propTypes = {
	bigImgShow: PropTypes.string,
};

export default App;
