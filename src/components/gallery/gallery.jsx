/** @format */

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
	BsFillSkipForwardFill,
	BsFillSkipBackwardFill,
	BsArrowRightSquareFill,
	BsArrowLeftSquareFill,
} from 'react-icons/bs';
import { Notify } from 'notiflix';
import { fetchImage } from '../service/fetch_api';
import ImageItem from '../galleryitem';
import Button from '../button';
import Loader from '../loader';
import ErrorComponent from 'components/service/error';
import './style.css';

function ImageGallery({ searchItem, isNewSearch, onClickBigImage, onSearchCompeted }) {
	const [value, setValue] = useState('');
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(12);
	const [prevPerPage, setPrevPerPage] = useState('');
	const [foundImages, setFoundImages] = useState([]);
	const [totalImages, setTotalImages] = useState(0);
	const [countPage, setCountPage] = useState(0);
	const [statusComponent, setStatusComponent] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!isNewSearch) {
			return;
		}
		setPage(1);
		setPerPage(12);
		onSearchCompeted();
	}, [isNewSearch, onSearchCompeted]);

	useEffect(() => {
		setPage(1);
		setPrevPerPage(perPage);
	}, [perPage]);

	useEffect(() => {
		if (!searchItem) {
			return;
		}

		setStatusComponent('pending');

		fetchImage({
			searchItem,
			page: prevPerPage !== perPage ? 1 : page,
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, searchItem, perPage]);

	if (statusComponent === 'pending') {
		return <Loader />;
	}

	if (statusComponent === 'resolved') {
		return (
			<>
				<ul className='gallery-container'>
					{foundImages.length > 0 ? (
						foundImages.map(item => (
							<ImageItem
								key={item.id}
								srcUrl={item.webformatURL}
								dataset={item.largeImageURL}
								tags={item.tags}
								onClick={({ target }) => onClickBigImage(target.dataset.largeurl)}
							/>
						))
					) : (
						<ErrorComponent>
							Images <span className='search-item'>{searchItem}</span> not found
						</ErrorComponent>
					)}
				</ul>
				{page > 0 && countPage > 0 && (
					<div className='status-container'>
						<div className='page-stat'>
							<p className='page-count'>item in page:</p>
							<input
								type='number'
								className='page-item'
								value={value}
								min={1}
								max={totalImages >= 200 ? 200 : totalImages}
								onChange={({ target }) => setValue(target.value.trim())}
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
					</div>
				)}
			</>
		);
	}

	if (statusComponent === 'rejected') {
		return <ErrorComponent className={'error'}>{error}</ErrorComponent>;
	}
}

ImageGallery.propTypes = {
	searchItem: PropTypes.string.isRequired,
	isNewSearch: PropTypes.bool.isRequired,
	onClickBigImage: PropTypes.func.isRequired,
	onSearchCompeted: PropTypes.func.isRequired,
};

export default ImageGallery;
