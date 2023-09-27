/** @format */

import PropTypes from 'prop-types';
import GalleryItem from '../galleryitem';
import './style.css';

function Gallery({ images, onClickBigImage }) {
	return (
		<ul className='gallery-container'>
			{images.map(item => (
				<GalleryItem
					key={item.id}
					srcUrl={item.webformatURL}
					dataset={item.largeImageURL}
					tags={item.tags}
					onClick={({ target }) => onClickBigImage(target.dataset.largeurl)}
				/>
			))}
		</ul>
	);
}

Gallery.propTypes = {
	images: PropTypes.arrayOf(
		PropTypes.exact({
			id: PropTypes.number.isRequired,
			webformatURL: PropTypes.string.isRequired,
			largeImageURL: PropTypes.string.isRequired,
			tags: PropTypes.string.isRequired,
		})
	).isRequired,
	onClickBigImage: PropTypes.func,
};

export default Gallery;
