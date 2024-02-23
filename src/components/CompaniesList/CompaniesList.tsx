import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { toggleAllCompaniesCheck } from '../../store/mockDataSlice';
import { CompamyItem } from '../CompamyItem/CompamyItem';
import style from './CompaniesList.module.css';
import { ItemCompany } from '../CompamyItem/CompamyItem.props';

export const CompaniesList: React.FC<{ items: ItemCompany[] }> = ({ items }) => {
	const isAllCompaniesChecked = useSelector(
		(state: RootState) => state.mockData.isAllCompaniesChecked
	);

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
								checked={isAllCompaniesChecked}
								onChange={(event) => {
									const target = event.nativeEvent.target as HTMLInputElement | null;
									if (target) {
										dispatch(toggleAllCompaniesCheck(target.checked));
									}
								}}
							/>
						</div>
						<div className={style.list__name}>Название компании</div>
						<div className={style.list__quantity}>
							Количество
							<br />
							сотрудников
						</div>
						<div className={style.list__address}>Адрес</div>
					</div>
					{items.map((item) => (
						<CompamyItem key={item.id} item={item} />
					))}
				</div>
			) : (
				<>{null}</>
			)}
		</>
	);
};
