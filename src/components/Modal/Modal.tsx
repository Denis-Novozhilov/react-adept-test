import { ReactNode, MouseEvent, FC, Dispatch, SetStateAction } from 'react';
import style from './Modal.module.css';

interface ModalProps {
	isActive: boolean;
	setActive: Dispatch<SetStateAction<boolean>>;
	children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ isActive, setActive, children }) => {
	return (
		<>
			<div
				className={`${style.modal} ${isActive ? style.active : ''}`}
				onClick={() => setActive(false)}
			>
				<div
					className={`${style.modal__content} ${isActive ? style.active : ''}`}
					onClick={(e: MouseEvent<HTMLDivElement>) => {
						e.stopPropagation();
					}}
				>
					<button className={style.modal__close} onClick={() => setActive(false)}>
						X
					</button>
					{children}
				</div>
			</div>
		</>
	);
};
