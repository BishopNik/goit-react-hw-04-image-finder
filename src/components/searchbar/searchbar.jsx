/** @format */

import { Component } from 'react';
import { GoSearch } from 'react-icons/go';
import { Notify } from 'notiflix';
import Button from '../button';
import './style.css';

class Searchbar extends Component {
	state = {
		value: '',
	};

	handlerOnSubmit = e => {
		e.preventDefault();
		if (!this.state.value) {
			Notify.warning('Search bar is empty.');
			return;
		}
		this.props.handlerSearch(this.state.value);
		this.setState({ value: '' });
	};

	handerlOnChange = ({ target }) => {
		this.setState({ value: target.value.trim() });
	};

	render() {
		return (
			<form className='searbar-container' onSubmit={this.handlerOnSubmit}>
				<Button type={'submit'} className={'button-search'}>
					<GoSearch className='icon' />
				</Button>
				<input
					className='input'
					type='text'
					onChange={this.handerlOnChange}
					value={this.state.value}
					autoComplete='off'
					autoFocus
					placeholder='Search images and photos'
				/>
			</form>
		);
	}
}

export default Searchbar;
