import { useDispatch, useSelector } from 'react-redux';
import { ItemRow } from '../ItemRow/ItemRow';
import { ItemCompany, ItemWorker } from '../ItemRow/ItemRow.props';
import style from './List.module.css';
import { AppDispatch, RootState } from '../../store';
import { toggleAllCompaniesCheck, toggleAllWorkersCheck } from '../../store/mockDataSlice';

export const List = ({ items }: { items: ItemCompany[] | ItemWorker[] }) => {
	const isAllCompaniesChecked = useSelector(
		(state: RootState) => state.mockData.isAllCompaniesChecked
	);
	const isAllWorkersChecked = useSelector((state: RootState) => state.mockData.isAllWorkersChecked);

	// const [checkedAll, setCheckedAll] = useState(false);

	const dispatch = useDispatch<AppDispatch>();
	return (
		<>
			{items.length > 0 ? (
				<>
					<div className={style.list}>
						<div className={style.list__head}>
							<div className={style.empty}>
								{'companyName' in items[0] ? (
									<input
										type="checkbox"
										name=""
										id=""
										checked={isAllCompaniesChecked}
										onChange={(event) => {
											// console.log(`event`);
											// console.log(event);
											// console.log(event.nativeEvent.target.checked);
											dispatch(toggleAllCompaniesCheck(event.nativeEvent.target.checked));
										}}
									/>
								) : (
									<input
										type="checkbox"
										name=""
										id=""
										checked={isAllWorkersChecked}
										onChange={(event) => {
											// console.log(`event`);
											// console.log(event);
											// console.log(event.nativeEvent.target.checked);
											dispatch(toggleAllWorkersCheck(event.nativeEvent.target.checked));
										}}
									/>
								)}
							</div>
							{'companyName' in items[0] ? (
								<>
									<div className={style.c_name}>Название компании</div>
									<div className={style.c_quantity}>
										Количество
										<br />
										сотрудников
									</div>
									<div className={style.c_address}>Адрес</div>
								</>
							) : (
								<>
									<div className={style.w_surname}>Фамилия</div>
									<div className={style.w_name}>Имя</div>
									<div className={style.w_role}>Должность</div>
								</>
							)}
						</div>
						{items.map((item) => (
							<ItemRow key={item.id} item={item} />
						))}
					</div>
				</>
			) : (
				<>{null}</>
			)}
		</>
	);
};
