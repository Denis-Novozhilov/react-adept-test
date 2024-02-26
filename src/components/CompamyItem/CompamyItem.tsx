import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { addCompanyItemSelection, deleteCompanyItemSelection } from '../../store/mockDataSlice';
import style from './CompamyItem.module.css';
import { ItemCompany } from '../../types/types';

export const CompamyItem: React.FC<{ item: ItemCompany }> = ({ item }) => {
	const isAllCompaniesChecked = useSelector(
		(state: RootState) => state.mockData.isAllCompaniesChecked
	);
	const [checked, setChecked] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		setChecked(isAllCompaniesChecked);
	}, [isAllCompaniesChecked]);

	return (
		<div className={`${style.item} ${checked ? style.checked : ''}`}>
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
									dispatch(deleteCompanyItemSelection(item));
								} else {
									dispatch(addCompanyItemSelection(item));
								}
							});
							return !flag;
						});
					}}
				/>
			</div>

			<div className={style.item__name}>{item.companyName ?? ''}</div>
			<div className={style.item__quantity}>{item.workersQuantity ?? ''}</div>
			<div className={style.item__address}>{item.address ?? ''}</div>
		</div>
	);
};
