import { ItemCompany, ItemWorker } from './ItemRow.props';
import style from './ItemRow.module.css';
import cn from 'classnames';
import { useState } from 'react';
import { AppDispatch } from '../../store';
import { useDispatch } from 'react-redux';
// import { addCompanyItemSelection } from '../../actions';
import { addCompanyItemSelection, deleteCompanyItemSelection } from '../../store/mockDataSlice';

export const ItemRow = ({ item }: { item: ItemCompany | ItemWorker }) => {
	const [checked, setChecked] = useState(false);
	// const dispatch: AppDispatch = useDispatch();
	const dispatch = useDispatch<AppDispatch>();
	return (
		<div className={cn(style.row, { [style.checked]: checked })}>
			<div className={style.check}>
				<input
					type="checkbox"
					name=""
					id=""
					onChange={() => {
						setChecked((flag) => {
							if (flag) {
								dispatch(deleteCompanyItemSelection(item));
							} else {
								console.log(`addCompanyItemSelection`);
								dispatch(addCompanyItemSelection(item));
							}
							return !flag;
						});
					}}
				/>
			</div>
			{'companyName' in item ? (
				<>
					<div className={style.c_name}>{item.companyName ?? ''}</div>
					<div className={style.c_quantity}>{item.workersQuantity ?? ''}</div>
					<div className={style.c_address}>{item.address ?? ''}</div>
				</>
			) : (
				<>
					<div className={style.w_name}>{item.name ?? ''}</div>
					<div className={style.w_surname}>{item.surname ?? ''}</div>
					<div className={style.w_role}>{item.role ?? ''}</div>
				</>
			)}
		</div>
	);
};
