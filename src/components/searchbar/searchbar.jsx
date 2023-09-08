/** @format */

import { useState } from 'react';
import { GoSearch } from 'react-icons/go';
import PropTypes from 'prop-types';
import { Notify } from 'notiflix';
import Button from '../button';
import './style.css';

function Searchbar({ handlerSearch }) {
	const [value, setValue] = useState('');

	const handlerOnSubmit = e => {
		e.preventDefault();
		if (!value) {
			Notify.warning('Search bar is empty.');
			return;
		}
		handlerSearch(value);
		setValue('');
	};

	const handerlOnChange = ({ target }) => {
		setValue(target.value.trim());
	};

	return (
		<form className='searbar-container' onSubmit={handlerOnSubmit}>
			<Button type={'submit'} className={'button-search'}>
				<GoSearch className='icon' />
			</Button>
			<input
				className='input'
				type='text'
				onChange={handerlOnChange}
				value={value}
				autoComplete='off'
				autoFocus
				placeholder='Search images and photos'
			/>
		</form>
	);
}

Searchbar.propTypes = {
	handlerSearch: PropTypes.func.isRequired,
};

export default Searchbar;
