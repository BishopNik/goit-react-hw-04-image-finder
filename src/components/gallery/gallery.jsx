/** @format */

import { Component } from 'react';
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
import { ErrorComponent } from 'components/service/error';
import './style.css';

class ImageGallery extends Component {
	state = {
		searchItem: '',
		value: '',
		page: 1,
		perPage: 12,
		foundImages: [],
		countFoundItem: 0,
		countPage: 0,
		isLoading: false,
		statusComponent: null,
		error: null,
	};

	static propTypes = {
		searchItem: PropTypes.string.isRequired,
		isNewSearch: PropTypes.bool.isRequired,
		pageStart: PropTypes.number.isRequired,
		onClickBigImage: PropTypes.func.isRequired,
		onSearchCompeted: PropTypes.func.isRequired,
	};

	componentDidUpdate = (prevProps, prevState) => {
		const { page, perPage, countPage } = this.state;
		const { searchItem, pageStart, isNewSearch, onSearchCompeted } = this.props;
		if (
			prevProps.searchItem !== searchItem ||
			(prevProps.isNewSearch !== isNewSearch && isNewSearch === true) ||
			prevState.page !== page ||
			prevState.perPage !== perPage
		) {
			const currentPage = searchItem !== prevProps.searchItem ? pageStart : page;
			this.setState({
				statusComponent: 'pending',
				searchItem,
				page: currentPage,
			});
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
					const pages = page === 1 ? Math.ceil(totalHits / perPage) : countPage;
					this.setState(prevState => ({
						...prevState,
						foundImages,
						countFoundItem: totalHits,
						countPage: pages,
						statusComponent: 'resolved',
						value: perPage,
					}));
				})
				.catch(({ message }) => {
					this.setState({
						statusComponent: 'rejected',
						error: message,
					});
					Notify.failure('Unable to load results. ' + message);
				})
				.finally(onSearchCompeted);
		}
	};

	changePage = pg => {
		const { countPage } = this.state;
		this.setState(
			prevState => {
				const newPage = prevState.page + pg;
				if (1 <= newPage && newPage <= countPage) {
					return {
						page: newPage,
					};
				}
				return null;
			},
			() => {
				const { page, countPage } = this.state;
				switch (page) {
					case 1:
						Notify.info('First page');
						return;
					case countPage:
						Notify.info('Last page');
						return;
					default:
						break;
				}
			}
		);
	};

	handleClick = ({ target }) => {
		const bigImageSrc = target.dataset.largeurl;
		this.props.onClickBigImage(bigImageSrc);
	};

	handlerChangeCountItem = ({ target }) => {
		this.setState({ value: target.value.trim() });
	};

	handlerSubmitCountItem = e => {
		if (e.key === 'Enter') {
			e.preventDefault();
			const { value } = this.state;
			console.log(value);
			if (value) {
				this.setState({ perPage: parseInt(value) });
			}
		}
	};

	render() {
		const { page, countPage, searchItem, perPage, statusComponent, foundImages, error, value } =
			this.state;
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
									onClick={this.handleClick}
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
									max={perPage}
									onChange={this.handlerChangeCountItem}
									onKeyDown={this.handlerSubmitCountItem}
								/>
								<div className='page-count'>
									page: {page} / {countPage}
								</div>
							</div>
							<Button
								className={'loadmore'}
								type={'button'}
								onClick={() => {
									this.setState({ page: 1 });
									Notify.info('First page');
								}}
							>
								<BsFillSkipBackwardFill />
							</Button>
							<Button
								className={'loadmore'}
								type={'button'}
								onClick={() => this.changePage(-1)}
							>
								<BsArrowLeftSquareFill />
							</Button>
							<Button
								className={'loadmore'}
								type={'button'}
								onClick={() => this.changePage(1)}
							>
								<BsArrowRightSquareFill />
							</Button>
							<Button
								className={'loadmore'}
								type={'button'}
								onClick={() => {
									this.setState({ page: countPage });
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
}

export default ImageGallery;
