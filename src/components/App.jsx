/** @format */

import { useState, useEffect, useMemo } from 'react';
import {
	BsFillSkipForwardFill,
	BsFillSkipBackwardFill,
	BsArrowRightSquareFill,
	BsArrowLeftSquareFill,
} from 'react-icons/bs';
import { Notify } from 'notiflix';
import Searchbar from './searchbar';
import Gallery from './gallery';
import Modal from './modal';
import { fetchImage } from './service/fetch_api';
import Button from './button';
import Loader from './loader';
import ErrorComponent from './service/error';
import './style.css';

import { debounce } from 'lodash';

function App() {
	const [searchItem, setSearchItem] = useState('');
	const [isModalShow, setIsModalShow] = useState(false);
	const [bigImgShow, setBigImgShow] = useState('');
	const [value, setValue] = useState('');
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(12);
	const [foundImages, setFoundImages] = useState([]);
	const [totalImages, setTotalImages] = useState(0);
	const [countPage, setCountPage] = useState(0);
	const [statusComponent, setStatusComponent] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		setPage(1);
	}, [perPage]);

	useEffect(() => {
		if (!searchItem) {
			return;
		}

		setStatusComponent('pending');

		fetchImage({
			searchItem,
			page,
			perPage,
		})
			.then(({ hits, totalHits }) => {
				const foundImages = [];
				hits.forEach(({ id, webformatURL, largeImageURL, tags }) => {
					if (id && webformatURL && largeImageURL && tags) {
						foundImages.push({ id, webformatURL, largeImageURL, tags });
					}
				});
				setValue(perPage);
				setTotalImages(totalHits);
				setFoundImages(foundImages);
				setCountPage(Math.ceil(totalHits / perPage));
				setStatusComponent('resolved');
			})
			.catch(({ message }) => {
				setStatusComponent('rejected');
				setError(message);
				Notify.failure('Unable to load results. ' + message);
			});
	}, [page, searchItem, perPage]);

	const handlerChangeSearchValue = value => {
		setSearchItem(value);
		setPage(1);
	};

	const handleClick = bigImageSrc => {
		setIsModalShow(true);
		setBigImgShow(bigImageSrc);
	};

	const handlerCloseModal = () => {
		setIsModalShow(false);
	};

	const setCountGallaryItem = value => {
		setPerPage(parseInt(value));
	};

	const debouncedSetCountGallaryItem = useMemo(() => debounce(setCountGallaryItem, 1000), []);

	const handlerSubmitCountItem = ({ target }) => {
		debouncedSetCountGallaryItem(target.value.trim());
	};

	return (
		<div className='container'>
			{isModalShow && (
				<Modal onClose={handlerCloseModal}>
					<img src={bigImgShow} alt='Big Search Element' />
				</Modal>
			)}

			<Searchbar handlerSearch={handlerChangeSearchValue} />

			{statusComponent === 'pending' && <Loader />}

			{statusComponent === 'resolved' && (
				<>
					{foundImages.length > 0 ? (
						<>
							<Gallery images={foundImages} onClick={handleClick} />
							<div className='status-container'>
								{page > 0 && countPage > 0 && (
									<div className='page-stat'>
										<p className='page-count'>item in page:</p>
										<input
											type='number'
											className='page-item'
											value={value}
											min={2}
											max={totalImages >= 200 ? 200 : totalImages}
											onInput={({ target }) => setValue(target.value.trim())}
											onChange={handlerSubmitCountItem}
											onKeyDown={e => {
												if (e.key === 'Enter') {
													e.preventDefault();
													if (value) {
														setPerPage(parseInt(value));
													}
												}
											}}
										/>
										<div className='page-count'>
											page: {page} / {countPage}
										</div>
									</div>
								)}
								{countPage > 1 && (
									<>
										<Button
											className={'loadmore'}
											type={'button'}
											onClick={() => {
												setPage(1);
												Notify.info('First page');
											}}
										>
											<BsFillSkipBackwardFill />
										</Button>
										<Button
											className={'loadmore'}
											type={'button'}
											onClick={() => {
												if (page > 1) {
													setPage(page => page - 1);
												} else Notify.info('First page');
											}}
										>
											<BsArrowLeftSquareFill />
										</Button>
										{page !== countPage && (
											<>
												<Button
													className={'loadmore'}
													type={'button'}
													onClick={() => {
														if (page < perPage) {
															setPage(page => page + 1);
														} else Notify.info('Last page');
													}}
												>
													<BsArrowRightSquareFill />
												</Button>
												<Button
													className={'loadmore'}
													type={'button'}
													onClick={() => {
														setPage(countPage);
														Notify.info('Last page');
													}}
												>
													<BsFillSkipForwardFill />
												</Button>
											</>
										)}
									</>
								)}
							</div>
						</>
					) : (
						<ErrorComponent>
							Images <span className='search-item'>{searchItem}</span> not found
						</ErrorComponent>
					)}
				</>
			)}

			{statusComponent === 'rejected' && (
				<ErrorComponent className={'error'}>{error}</ErrorComponent>
			)}
		</div>
	);
}

export default App;
