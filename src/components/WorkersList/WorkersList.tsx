import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { toggleAllWorkersCheck } from '../../store/mockDataSlice';
import { WorkerItem } from '../WorkerItem/WorkerItem';
import style from './WorkersList.module.css';
import { ItemWorker } from '../WorkerItem/WorkerItem.props';

export const WorkersList: React.FC<{ items: ItemWorker[] }> = ({ items }) => {
	const isAllWorkersChecked = useSelector((state: RootState) => state.mockData.isAllWorkersChecked);
	const dispatch = useDispatch<AppDispatch>();

	return (
		<>
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
				<>{null}</>
			)}
		</>
	);
};
