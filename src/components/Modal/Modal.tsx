import React from 'react';
import style from './Modal.module.css';
import cn from 'classnames';

export const Modal = ({ isActive, setActive, children }) => {
	return (
		<>
			{/* <div className={isActive ? style.modal_active : style.modal} onClick={() => setActive(false)}> */}
			<div
				className={cn(style.modal, { [style.active]: isActive })}
				onClick={() => setActive(false)}
			>
				{/* <div
					className={isActive ? style.modal__content_active : style.modal__content}
					onClick={(e) => {
						e.stopPropagation();
					}}
				> */}
				<div
					className={cn(style.modal__content, { [style.active]: isActive })}
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<button onClick={() => setActive(false)}>X</button>
					{children}
				</div>
			</div>
		</>
	);
};
