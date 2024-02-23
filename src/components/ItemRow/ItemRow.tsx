import { useEffect, useState } from 'react';
import { ItemCompany, ItemWorker } from './ItemRow.props';
import style from './ItemRow.module.css';
import cn from 'classnames';
import { AppDispatch, RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import {
	addCompanyItemSelection,
	addWorkerItemSelection,
	deleteCompanyItemSelection,
	deleteWorkerItemSelection
} from '../../store/mockDataSlice';

export const ItemRow = ({ item }: { item: ItemCompany | ItemWorker }) => {
	const isAllCompaniesChecked = useSelector(
		(state: RootState) => state.mockData.isAllCompaniesChecked
	);
	const isAllWorkersChecked = useSelector((state: RootState) => state.mockData.isAllWorkersChecked);

	const [checked, setChecked] = useState(false);

	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		'companyName' in item ? setChecked(isAllCompaniesChecked) : setChecked(isAllWorkersChecked);
	}, ['companyName' in item ? isAllCompaniesChecked : isAllWorkersChecked]);

	return (
		<div className={cn(style.row, { [style.checked]: checked })}>
			<div className={style.check}>
				{'companyName' in item ? (
					<input
						type="checkbox"
						name=""
						id=""
						checked={checked}
						onChange={() => {
							setChecked((flag) => {
								dispatch((dispatch) => {
									if (flag) {
										dispatch(deleteCompanyItemSelection(item));
									} else {
										dispatch(addCompanyItemSelection(item));
									}
								});
								return !flag;
							});
						}}
					/>
				) : (
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
				)}
			</div>
			{'companyName' in item ? (
				<>
					<div className={style.c_name}>{item.companyName ?? ''}</div>
					<div className={style.c_quantity}>{item.workersQuantity ?? ''}</div>
					<div className={style.c_address}>{item.address ?? ''}</div>
				</>
			) : (
				<>
					<div className={style.w_surname}>{item.surname ?? ''}</div>
					<div className={style.w_name}>{item.name ?? ''}</div>
					<div className={style.w_role}>{item.role ?? ''}</div>
				</>
			)}
		</div>
	);
};
