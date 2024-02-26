import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { deleteSelectedWorkersItems, toggleAllWorkersCheck } from '../../store/mockDataSlice';
import { WorkerItem } from '../WorkerItem/WorkerItem';
import style from './WorkersList.module.css';
// import { ItemWorker } from '../WorkerItem/WorkerItem.props';
import cn from 'classnames';
import { ItemWorker } from '../../types/types';

export const WorkersList: React.FC<{ items: ItemWorker[] }> = ({ items }) => {
	const { isAllWorkersChecked, selectedWorkersIds } = useSelector(
		(state: RootState) => state.mockData
	);

	const dispatch = useDispatch<AppDispatch>();

	return (
		<>
			<div className={style.list__controls}>
				<button className={cn(style.list__createItem)}>create</button>
				<button
					disabled={(items.length === 0, selectedWorkersIds.length === 0)}
					className={style.list__deleteItem}
					onClick={() => {
						dispatch(deleteSelectedWorkersItems());
					}}
				>
					delete
				</button>
			</div>
			{items.length > 0 ? (
				<div className={style.list}>
					<div className={style.list__head}>
						<div className={style.list__checker}>
							<input
								type="checkbox"
								name=""
								id=""
								checked={isAllWorkersChecked}
								onChange={(event) => {
									const target = event.nativeEvent.target as HTMLInputElement | null;
									if (target) {
										dispatch(toggleAllWorkersCheck(target.checked));
									}
								}}
							/>
						</div>

						<div className={style.list__surname}>Фамилия</div>

						<div className={style.list__name}>Имя</div>

						<div className={style.list__role}>Должность</div>
					</div>
					{items.map((item) => (
						<WorkerItem key={item.id} item={item} />
					))}
				</div>
			) : (
				<p className={style.list__notification}>список сотрудников пуст</p>
			)}
		</>
	);
};
