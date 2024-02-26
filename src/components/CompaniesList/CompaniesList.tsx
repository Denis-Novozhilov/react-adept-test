import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
	deleteSelectedCompaniesItems,
	toggleAllCompaniesCheck,
	createNewCompany
} from '../../store/mockDataSlice';
import { CompamyItem } from '../CompamyItem/CompamyItem';
import style from './CompaniesList.module.css';
import { ItemCompany } from '../CompamyItem/CompamyItem.props';
import cn from 'classnames';
import { Modal } from '../Modal/Modal';
import { useEffect, useRef, useState } from 'react';

export const CompaniesList: React.FC<{ items: ItemCompany[] }> = ({ items }) => {
	const [modalIsActive, setModalIsActive] = useState(true);
	const [workersForms, setWorkersForms] = useState(0);
	const [workersCsvForm, setWorkersCsvForm] = useState(false);
	const initialFormState = {
		companyName: '',
		companyWorkersQuantity: '',
		companyAddress: '',
		isWorkersDataInputs: false,
		companyWorkersDataInputs: {},
		isWorkersDataCsv: false,
		companyWorkersDataCsv: []
	};
	const [formState, setFormState] = useState(initialFormState);

	const [csvData, setCsvData] = useState([]);

	const handleFileChange = (e) => {
		const file = e.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = (event) => {
				const csvString = event.target.result;
				const parsedData = parseCsv(csvString);

				setCsvData(parsedData);

				console.log(`parsedData`);
				console.log(parsedData);
				/*
						[
							{	"surname": "Иванов",		"name": "Петр",			"role": "Инженер"	},
							{	"surname": "Васильев",		"name": "Николай",		"role": "Архитектор"	},
							{	"surname": "Павловский",	"name": "Сергей",		"role": "Конструктор инженер"	},
							{	"surname": "Илларионова",	"name": "Наталья",		"role": "Главный бухгалтер"	},
							{	"surname": "Поваров",		"name": "Константин",	"role": "Секретарь"	},
							{	"surname": "Игнатьев",		"name": "Алексей",		"role": "Прораб"	},
							{	"surname": "Богомолов",		"name": "Илья",			"role": "Архитектор"	},
							{	"surname": "Васильева",		"name": "Татьяна",		"role": "Бухгалтер"	},
							{	"surname": "Каренин",		"name": "Виктор",		"role": "Инженер"	},
							{	"surname": "Порамонов",		"name": "Алексей",		"role": "Бульдозерист"	},
							{	"surname": "Кривошеев",		"name": "Василий",		"role": "Программист"	}
						]
				*/

				setFormState({
					...formState,
					companyWorkersDataCsv: [...formState.companyWorkersDataCsv, ...parsedData]
				});
			};

			reader.readAsText(file);
		}
	};

	const parseCsv = (csvString) => {
		const rows = csvString.split('\n');
		const header = rows[0].split(',');
		const data = rows.slice(1).map((rowString) => {
			const values = rowString.split(',');
			return header.reduce((obj, header, index) => {
				obj[header] = values[index];
				return obj;
			}, {});
		});

		return data;
	};

	const formRef = useRef(null);
	const fileInputRef = useRef(null);

	const onFormChange = (e) => {
		const { target } = e;
		console.log({ target });
		// target.dataset.worker;
		if (e.target.name.includes('_workersDataInput_')) {
			console.log(`e.target.name.includes('_workersDataInput_'`);
			console.log({ target });
			setFormState({
				...formState,
				companyWorkersDataInputs: {
					...formState.companyWorkersDataInputs,
					[e.target.dataset.worker]: {
						...formState.companyWorkersDataInputs[e.target.dataset.worker],
						[e.target.dataset.key]: e.target.value
					}
				}
			});
		} else if (
			e.target.dataset.name === 'flag-is-workers-data' ||
			e.target.dataset.name === 'flag-is-workers-csv-data'
		) {
			setFormState({ ...formState, [e.target.name]: e.target.checked });
		} else {
			setFormState({ ...formState, [e.target.name]: e.target.value });
		}
	};

	const { isAllCompaniesChecked, selectedCompaniesIds } = useSelector(
		(state: RootState) => state.mockData
	);

	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		setFormState(initialFormState);
		setWorkersForms(0);
		setCsvData([]);
		setWorkersCsvForm(false);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}, [modalIsActive]);

	return (
		<>
			<div className="list__controls">
				<button className={cn(style.list__createItem)} onClick={() => setModalIsActive(true)}>
					create
				</button>
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
			<Modal isActive={modalIsActive} setActive={setModalIsActive}>
				<h2>Создать новую компанию</h2>
				<form className={style.list__modal} ref={formRef} action="#">
					<label htmlFor="companyName">
						Название компании
						<input
							type="text"
							name="companyName"
							id="companyName"
							onChange={onFormChange}
							value={formState.companyName}
							required
						/>
					</label>
					<label htmlFor="companyWorkersQuantity">
						Количество сотрудников
						<input
							type="number"
							min="0"
							max="100000"
							name="companyWorkersQuantity"
							id="companyWorkersQuantity"
							value={formState.companyWorkersQuantity}
							onChange={(e) => {
								onFormChange(e);
								if (formState.isWorkersDataInputs) {
									setWorkersForms(e.target.value);
								}
							}}
						/>
					</label>
					<label htmlFor="isWorkersDataInputs">
						Ввести данные сотрудников
						<input
							type="checkbox"
							name="isWorkersDataInputs"
							data-name="flag-is-workers-data"
							id="isWorkersDataInputs"
							checked={!!formState.isWorkersDataInputs}
							onChange={(e) => {
								onFormChange(e);
								setWorkersForms(e.target.checked ? formState.companyWorkersQuantity : 0);
							}}
						/>
					</label>
					<label htmlFor="companyIsWorkersCsvData">
						Загрузить данные сотрудников CSV
						<input
							type="checkbox"
							name="isWorkersDataCsv"
							data-name="flag-is-workers-csv-data"
							id="companyIsWorkersCsvData"
							checked={!!formState.isWorkersDataCsv}
							onChange={(e) => {
								onFormChange(e);
								if (e.target.checked) {
									setWorkersCsvForm(true);
								} else {
									setWorkersCsvForm(false);
									setCsvData([]);
								}
								// setWorkersForms(e.target.checked ? formState.companyWorkersQuantity : 0);
							}}
						/>
					</label>
					{Boolean(workersForms) && (
						<>
							<div className={style.modal__optional}>
								{Array.from({ length: workersForms }).map((el, i) => {
									return (
										<div key={i + 'div'}>
											<h3 key={i + 'wh'}>Данные сотрудника {i + 1}</h3>
											<div className={style.modal__sub_group}>
												<label key={i + 'ws'} htmlFor={i + '_workersDataInput_Surname'}>
													Фамилия
													<input
														key={i + 'wsi'}
														type="text"
														id={i + '_workersDataInput_Surname'}
														name={i + '_workersDataInput_Surname'}
														data-worker={i + '_worker'}
														data-key={'surname'}
														// value={row.surname}
														onChange={onFormChange}
													/>
												</label>
												<label key={i + 'wn'} htmlFor={i + '_workersDataInput_Name'}>
													Имя
													<input
														key={i + 'wni'}
														type="text"
														id={i + '_workersDataInput_Name'}
														name={i + '_workersDataInput_Name'}
														data-worker={i + '_worker'}
														data-key={'name'}
														// value={row.name}
														onChange={onFormChange}
													/>
												</label>
												<label key={i + 'wr'} htmlFor={i + '_workersDataInput_Role'}>
													Должность
													<input
														key={i + 'wri'}
														type="text"
														id={i + '_workersDataInput_Role'}
														name={i + '_workersDataInput_Role'}
														data-worker={i + '_worker'}
														data-key={'role'}
														onChange={onFormChange}
													/>
												</label>
											</div>
										</div>
									);
								})}
							</div>
						</>
					)}
					{Boolean(workersCsvForm) && (
						<>
							<input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} />
							{csvData.length > 0 && (
								<div className={style.modal__optional}>
									{csvData.map((row, i) => {
										return (
											<div key={i + 'csv' + 'div'}>
												<h3 key={i + 'csv' + 'wh'}>Данные сотрудника {i + 1}</h3>
												<div className={style.modal__sub_group}>
													<label key={i + 'csv' + 'ws'} htmlFor={i + '_workersCsvData_Surname'}>
														Фамилия сотрудника {i + 1}
														<input
															key={i + 'csv' + 'wsi'}
															type="text"
															name={i + '_workersCsvData_Surname'}
															id={i + '_workersCsvData_Surname'}
															data-worker={i + '_worker'}
															data-key={'surname'}
															value={row.surname}
															onChange={onFormChange}
														/>
													</label>
													<label key={i + 'csv' + 'wn'} htmlFor={i + '_workersCsvData_Name'}>
														Имя сотрудника {i + 1}
														<input
															key={i + 'csv' + 'wni'}
															type="text"
															name={i + '_workersCsvData_Name'}
															id={i + '_workersCsvData_Name'}
															data-worker={i + '_worker'}
															data-key={'name'}
															value={row.name}
															onChange={onFormChange}
														/>
													</label>
													<label key={i + 'csv' + 'wr'} htmlFor={i + '_workersCsvData_Role'}>
														Должность сотрудника {i + 1}
														<input
															key={i + 'csv' + 'wri'}
															type="text"
															name={i + '_workersCsvData_Role'}
															id={i + '_workersCsvData_Role'}
															data-worker={i + '_worker'}
															data-key={'role'}
															value={row.role}
															onChange={onFormChange}
														/>
													</label>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</>
					)}
					<label htmlFor="companyAddress">
						Адрес компании
						<input
							type="text"
							name="companyAddress"
							id="companyAddress"
							value={formState.companyAddress}
							onChange={onFormChange}
							required
						/>
					</label>
					<div className={style.modal__controllers}>
						<button
							onClick={(e) => {
								console.log(`formState`);
								console.log(`formState`);
								console.log(`formState`);
								console.log(formState);
								console.log(`formState`);
								console.log(`formState`);
								console.log(`formState`);
								e.preventDefault();
								if (formRef.current.checkValidity()) {
									dispatch(
										createNewCompany({
											name: formState.companyName,
											quantity: parseInt(formState.companyWorkersQuantity, 10),
											address: formState.companyAddress,
											isWorkersDataInputs: formState.isWorkersDataInputs,
											workersData: formState.companyWorkersDataInputs,
											isWorkersDataCsv: formState.isWorkersDataCsv,
											workersCsvData: formState.companyWorkersDataCsv
										})
									);
									setModalIsActive(false);
								} else {
									formRef.current.reportValidity();
									return;
								}

								/*
									{
										"companyName": "ййй",
										"companyWorkersQuantity": "2",
										"companyIsWorkersData": true,
										"companyWorkersDataInputs": {
											"0_worker": { "surname": "11", "name": "11", "role": "11" },
											"1_worker": { "surname": "22", "name": "22", "role": "22" }
										},
										"companyAddress": "33ааыуау"
									}
								*/
							}}
						>
							Создать
						</button>
					</div>
				</form>
			</Modal>
		</>
	);
};
