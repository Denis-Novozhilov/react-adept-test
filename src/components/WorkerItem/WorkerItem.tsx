import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { addWorkerItemSelection, deleteWorkerItemSelection } from '../../store/mockDataSlice';
import style from './WorkerItem.module.css';
import { ItemWorker } from '../../types/types';
// import { ItemWorker } from './WorkerItem.props';

export const WorkerItem: React.FC<{ item: ItemWorker }> = ({ item }) => {
	const isAllWorkersChecked = useSelector((state: RootState) => state.mockData.isAllWorkersChecked);

	const [checked, setChecked] = useState(false);

	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		setChecked(isAllWorkersChecked);
	}, [isAllWorkersChecked]);

	return (
		<div className={cn(style.item, { [style.checked]: checked })}>
			<div className={style.item__checker}>
				<input
					type="checkbox"
					name=""
					id=""
					checked={checked}
					onChange={() => {
						setChecked((flag) => {
							dispatch((dispatch) => {
								if (flag) {
									dispatch(deleteWorkerItemSelection(item));
								} else {
									dispatch(addWorkerItemSelection(item));
								}
							});
							return !flag;
						});
					}}
				/>
			</div>

			<div className={style.item__surname}>{item.surname ?? ''}</div>
			<div className={style.item__name}>{item.name ?? ''}</div>
			<div className={style.item__role}>{item.role ?? ''}</div>
		</div>
	);
};
