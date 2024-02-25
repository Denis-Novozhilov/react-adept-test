import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { deleteSelectedCompaniesItems, toggleAllCompaniesCheck } from '../../store/mockDataSlice';
import { CompamyItem } from '../CompamyItem/CompamyItem';
import style from './CompaniesList.module.css';
import { ItemCompany } from '../CompamyItem/CompamyItem.props';
import cn from 'classnames';

export const CompaniesList: React.FC<{ items: ItemCompany[] }> = ({ items }) => {
	const { isAllCompaniesChecked, selectedCompaniesIds } = useSelector(
		(state: RootState) => state.mockData
	);

	const dispatch = useDispatch<AppDispatch>();

	return (
		<>
			<div className="list__controls">
				<button className={cn(style.list__createItem)}>create</button>
				<button
					disabled={items.length === 0 || selectedCompaniesIds.length === 0}
					className={cn(style.list__deleteItem, { [style.disabled]: items.length === 0 })}
					onClick={() => {
						dispatch(deleteSelectedCompaniesItems());
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
				<p className={style.list__notification}>список компаний пуст</p>
			)}
		</>
	);
};
