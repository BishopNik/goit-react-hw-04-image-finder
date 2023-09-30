/** @format */

import { useState, useEffect } from 'react';
// import { useMemo } from 'react';
import { Notify } from 'notiflix';
import { nanoid } from 'nanoid';
import useDebounce from './service/useDebounce';
import Searchbar from './searchbar';
import Gallery from './gallery';
import Modal from './modal';
import { fetchImage } from './service/fetch_api';
import Loader from './loader';
import ErrorComponent from './service/error';
import Pagination from './pagination';
import './style.css';

// import { debounce } from 'lodash';

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
	const [newSearch, setNewSearch] = useState(nanoid());

	// useEffect(() => {
	// 	setPage(1);
	// }, [perPage]);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, searchItem, newSearch]);

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

	// const setCountGallaryItem = value => {
	// 	setPerPage(parseInt(value));
	// };

	// const debouncedSetCountGallaryItem = useMemo(() => debounce(setCountGallaryItem, 1000), []);

	// const handlerSubmitCountItem = ({ target }) => {
	// 	debouncedSetCountGallaryItem(target.value.trim());
	// };

	const handlerSubmitCountItem = ({ target }) => {
		setPerPage(parseInt(target.value.trim()));
	};

	const debouncedValue = useDebounce(perPage, 1000);

	useEffect(() => {
		setPage(1);
		setNewSearch(nanoid());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedValue]);

	const onChangeInput = ({ target }) => setValue(target.value.trim());

	const onChangePerPage = e => {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (value) {
				setPerPage(parseInt(value));
			}
		}
	};

	const onClickFirstPageButton = () => {
		setPage(1);
		Notify.info('First page');
	};

	const onClickLastPageButton = () => {
		setPage(countPage);
		Notify.info('Last page');
	};

	const onClickChangePage = pg => {
		switch (pg) {
			case -1:
				if (page > 1) {
					setPage(page => page - 1);
				} else Notify.info('First page');
				break;

			case 1:
				if (page < perPage) {
					setPage(page => page + pg);
				} else Notify.info('Last page');
				break;

			default:
				break;
		}
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
							<Pagination
								page={page}
								countPage={countPage}
								perPage={perPage}
								totalImages={totalImages}
								value={value}
								onChangeInput={onChangeInput}
								handlerSubmitCountItem={handlerSubmitCountItem}
								onChangePerPage={onChangePerPage}
								onClickFirstPageButton={onClickFirstPageButton}
								onClickLastPageButton={onClickLastPageButton}
								onClickChangePage={onClickChangePage}
							/>
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
