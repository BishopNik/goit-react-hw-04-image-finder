/** @format */

import { Component } from 'react';
import PropTypes from 'prop-types';
import Searchbar from './searchbar';
import ImageGallery from './gallery';
import Modal from './modal';

import './style.css';

class App extends Component {
	state = {
		searchItem: '',
		page: 1,
		isModalShow: false,
		isNewSearch: false,
		bigImgShow: '',
	};

	static propTypes = {
		bigImgShow: PropTypes.string,
	};

	handlerChangeSearchValue = value => {
		this.setState({ searchItem: value, isNewSearch: true });
	};

	handlerSearchComplete = value => {
		this.setState({ isNewSearch: false });
	};

	handleClick = bigImageSrc => {
		this.setState({ isModalShow: true, bigImgShow: bigImageSrc });
	};

	handlerCloseModal = () => {
		this.setState(({ isModalShow }) => ({ isModalShow: !isModalShow }));
	};

	render() {
		const { isModalShow, searchItem, page, isNewSearch, bigImgShow } = this.state;
		return (
			<div className='container'>
				{isModalShow && (
					<Modal onClose={this.handlerCloseModal}>
						<img src={bigImgShow} alt='Big Search Element' />
					</Modal>
				)}
				<Searchbar handlerSearch={this.handlerChangeSearchValue} />
				<ImageGallery
					searchItem={searchItem}
					pageStart={page}
					isNewSearch={isNewSearch}
					onClickBigImage={this.handleClick}
					onSearchCompeted={this.handlerSearchComplete}
				/>
			</div>
		);
	}
}

export default App;
