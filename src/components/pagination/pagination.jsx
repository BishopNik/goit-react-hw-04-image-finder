/** @format */

import {
	BsFillSkipForwardFill,
	BsFillSkipBackwardFill,
	BsArrowRightSquareFill,
	BsArrowLeftSquareFill,
} from 'react-icons/bs';
import Button from '../button';

function Pagination({
	page,
	countPage,
	value,
	totalImages,
	handlerSubmitCountItem,
	onChangePerPage,
	onChangeInput,
	onClickFirstPageButton,
	onClickLastPageButton,
	onClickChangePage,
}) {
	return (
		<div className='status-container'>
			{page > 0 && countPage > 0 && (
				<div className='page-stat'>
					<p className='page-count'>item in page:</p>
					<input
						type='number'
						className='page-item'
						value={value}
						min={3}
						max={totalImages >= 200 ? 200 : totalImages}
						onInput={onChangeInput}
						onChange={handlerSubmitCountItem}
						onKeyDown={onChangePerPage}
					/>
					<div className='page-count'>
						page: {page} / {countPage}
					</div>
				</div>
			)}
			{countPage > 1 && (
				<>
					<Button className={'loadmore'} type={'button'} onClick={onClickFirstPageButton}>
						<BsFillSkipBackwardFill />
					</Button>
					<Button
						className={'loadmore'}
						type={'button'}
						onClick={() => onClickChangePage(-1)}
					>
						<BsArrowLeftSquareFill />
					</Button>
					{page !== countPage && (
						<>
							<Button
								className={'loadmore'}
								type={'button'}
								onClick={() => onClickChangePage(+1)}
							>
								<BsArrowRightSquareFill />
							</Button>
							<Button
								className={'loadmore'}
								type={'button'}
								onClick={onClickLastPageButton}
							>
								<BsFillSkipForwardFill />
							</Button>
						</>
					)}
				</>
			)}
		</div>
	);
}

export default Pagination;
