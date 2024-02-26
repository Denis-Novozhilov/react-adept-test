import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
	deleteSelectedWorkersItems,
	toggleAllWorkersCheck,
	createNewCompany,
	injectWorkersToExistedCompany,
	toggleAllCompaniesCheck,
	deselectAllCompanyItems,
	deselectAllWorkersItems
} from '../../store/mockDataSlice';
import { WorkerItem } from '../WorkerItem/WorkerItem';
import style from './WorkersList.module.css';
import { InitialWorkerData, ItemWorker, ItemCompany } from '../../types/types';
import { Modal } from '../Modal/Modal';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { parseCsv } from '../../helpers/parseCsv';

export const WorkersList: React.FC<{ items: ItemWorker[] }> = ({ items }) => {
	const [modalIsActive, setModalIsActive] = useState(false);
	const [workersForms, setWorkersForms] = useState(0);
	const [workersCsvForm, setWorkersCsvForm] = useState(false);
	const [listedEmployerCompany, setListedEmployerCompany] = useState<ItemCompany[]>([]);
	const initialFormState = {
		companyName: '',
		companyWorkersQuantity: '',
		companyAddress: '',
		isWorkersDataInputs: false,
		isListedEmployerCompany: false,
		companyWorkersDataInputs: {} as Record<string, InitialWorkerData>,
		isWorkersDataCsv: false,
		companyWorkersDataCsv: [] as InitialWorkerData[],
		chosenListedEmployerCompanyId: ''
	};
	const { isAllWorkersChecked, selectedWorkersIds } = useSelector(
		(state: RootState) => state.mockData
	);

	const [csvData, setCsvData] = useState<InitialWorkerData[]>([]);
	const [formState, setFormState] = useState<typeof initialFormState>(initialFormState);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = (event) => {
				const csvString = event.target?.result as string | undefined;

				if (csvString !== undefined) {
					const parsedData: { [key: string]: string }[] = parseCsv(csvString);

					const transformedData: InitialWorkerData[] = parsedData.map((item) => ({
						surname: item.surname || '',
						name: item.name || '',
						role: item.role || ''
					}));

					setCsvData(transformedData);

					setFormState({
						...formState,
						companyWorkersDataCsv: [...formState.companyWorkersDataCsv, ...transformedData]
					});
				}
			};

			reader.readAsText(file);
		}
	};

	const formRef = useRef<HTMLFormElement | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const selectRef = useRef<HTMLSelectElement | null>(null);

	const onFormChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
		if (e.target.name.includes('_workersDataInput_')) {
			setFormState({
				...formState,
				companyWorkersDataInputs: {
					...formState.companyWorkersDataInputs,
					[e.target.dataset.worker as string]: {
						...formState.companyWorkersDataInputs[e.target.dataset.worker as string],
						[e.target.dataset.key as string]: e.target.value
					}
				}
			});
		} else if (
			e.target.dataset.name === 'flag-is-workers-data' ||
			e.target.dataset.name === 'flag-is-workers-csv-data'
		) {
			setFormState({ ...formState, [e.target.name]: (e.target as HTMLInputElement).checked });
		} else {
			setFormState({ ...formState, [e.target.name]: e.target.value });
		}
	};

	const { listedCompanies } = useSelector((state: RootState) => state.mockData);

	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		setFormState(initialFormState);
		setWorkersForms(0);
		setCsvData([]);
		setWorkersCsvForm(false);
		if (fileInputRef.current) {
			(fileInputRef.current as HTMLInputElement).value = '';
		}
	}, [modalIsActive]);

	return (
		<>
			<div className={style.list__controls}>
				<button
					className={style.list__createItem}
					onClick={() => {
						setModalIsActive(true);
					}}
				>
					create
				</button>
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
			<Modal isActive={modalIsActive} setActive={setModalIsActive}>
				<h2 className={style.modal__header}>Создать новых сотрудников</h2>
				<form className={style.list__modal} ref={formRef} action="#">
					<label htmlFor="companyName">
						Название компании
						<input
							type="text"
							name="companyName"
							id="companyName"
							onChange={onFormChange}
							value={
								formState.isListedEmployerCompany && formState.chosenListedEmployerCompanyId
									? listedCompanies[formState.chosenListedEmployerCompanyId].companyName
									: formState.companyName
							}
							disabled={formState.isListedEmployerCompany}
							required
						/>
					</label>
					<label htmlFor="companyAddress">
						Адрес компании
						<input
							type="text"
							name="companyAddress"
							id="companyAddress"
							value={
								formState.isListedEmployerCompany && formState.chosenListedEmployerCompanyId
									? listedCompanies[formState.chosenListedEmployerCompanyId].address
									: formState.companyAddress
							}
							onChange={onFormChange}
							disabled={formState.isListedEmployerCompany}
							required
						/>
					</label>
					<label className={style.modal__checkbox} htmlFor="isListedEmployerCompany">
						<p>Выбрать компанию из размещённых в списке</p>
						<input
							type="checkbox"
							name="isListedEmployerCompany"
							// data-name="flag-is-workers-data"
							data-name="flag-is-listed-employer-company"
							id="isListedEmployerCompany"
							checked={!!formState.isListedEmployerCompany}
							onChange={(e) => {
								onFormChange(e);
								setFormState((prev) => ({
									...prev,
									isListedEmployerCompany: e.target.checked,
									chosenListedEmployerCompanyId: Object.keys(listedCompanies)[0]
								}));
								setListedEmployerCompany(e.target.checked ? Object.values(listedCompanies) : []);
							}}
						/>
					</label>
					{formState.isListedEmployerCompany && (
						<select
							ref={selectRef}
							className={style.modal__options}
							name="chosenListedEmployerCompanyId"
							id="chosenListedEmployerCompanyId"
							onChange={onFormChange}
						>
							<>
								{Boolean(listedEmployerCompany.length) &&
									listedEmployerCompany.map((company) => (
										<option key={`option_${company.id}`} value={company.id}>
											{company.companyName}
										</option>
									))}
							</>
						</select>
					)}

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
									setWorkersForms(parseInt(e.target.value, 10));
								}
							}}
						/>
					</label>
					<label className={style.modal__checkbox} htmlFor="isWorkersDataInputs">
						<p>Ввести данные сотрудников вручную</p>
						<input
							type="checkbox"
							name="isWorkersDataInputs"
							data-name="flag-is-workers-data"
							id="isWorkersDataInputs"
							checked={!!formState.isWorkersDataInputs}
							onChange={(e) => {
								onFormChange(e);
								setWorkersForms(
									e.target.checked ? parseInt(formState.companyWorkersQuantity, 10) : 0
								);
							}}
						/>
					</label>
					<label className={style.modal__checkbox} htmlFor="companyIsWorkersCsvData">
						<p>Загрузить данные сотрудников CSV</p>
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

					<div className={style.modal__controllers}>
						<button
							onClick={(e) => {
								e.preventDefault();
								if (formState.isListedEmployerCompany) {
									const companyEmployer = listedCompanies[formState.chosenListedEmployerCompanyId];
									setFormState((prev) => {
										return {
											...prev,
											companyAddress: companyEmployer.address,
											companyName: companyEmployer.companyName
										};
									});

									dispatch(
										injectWorkersToExistedCompany({
											employerCompanyId: formState.chosenListedEmployerCompanyId,
											isWorkersDataInputs: formState.isWorkersDataInputs,
											workersData: formState.companyWorkersDataInputs,
											isWorkersDataCsv: formState.isWorkersDataCsv,
											workersCsvData: formState.companyWorkersDataCsv
										})
									);

									dispatch(toggleAllWorkersCheck(false));
									dispatch(toggleAllCompaniesCheck(false));
									dispatch(deselectAllCompanyItems());
									dispatch(deselectAllWorkersItems());
									setModalIsActive(false);
								} else if (formRef.current && formRef.current.checkValidity()) {
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
									dispatch(toggleAllWorkersCheck(false));
									setModalIsActive(false);
								} else {
									formRef.current && formRef.current.reportValidity();
									return;
								}
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
