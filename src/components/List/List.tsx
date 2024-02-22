import { ItemRow } from '../ItemRow/ItemRow';
import { ItemCompany, ItemWorker } from '../ItemRow/ItemRow.props';
import style from './List.module.css';

export const List = ({ items }: { items: ItemCompany[] | ItemWorker[] }) => {
	return (
		<>
			{items.length > 0 ? (
				<>
					<div className={style.list}>
						<div className={style.list__head}>
							<div className={style.empty}>
								<input type="checkbox" name="" id="" />
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
									<div className={style.w_name}>Имя</div>
									<div className={style.w_surname}>Фамилия</div>
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
