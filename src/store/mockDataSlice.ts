// mockDataSlice.js

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CreatelistedCompaniesList } from '../mock';
import { InitialWorkerData, ItemCompany, ItemWorker } from '../types/types';
import { uuid } from '../helpers/customUuid';

const COMPANIES_MOCK = CreatelistedCompaniesList(Math.round(Math.random() * 20));
const companiesInitialMap: Map<string, ItemCompany> = new Map();
COMPANIES_MOCK.forEach((company) => {
	companiesInitialMap.set(company.id, company);
});

interface MockDataState {
	isAllCompaniesChecked: boolean;
	isAllWorkersChecked: boolean;
	listedCompanies: Record<string, ItemCompany>;
	selectedCompaniesIds: string[];
	listedWorkers: Record<string, ItemWorker>;
	selectedWorkersIds: string[];
}

const initialState: MockDataState = {
	isAllCompaniesChecked: false,
	isAllWorkersChecked: false,

	listedCompanies: Object.fromEntries(companiesInitialMap),
	selectedCompaniesIds: [],

	listedWorkers: {},
	selectedWorkersIds: []
};

const mockDataSlice = createSlice({
	name: 'mockData',
	initialState,
	reducers: {
		addCompanyItemSelection: (state, action: PayloadAction<ItemCompany>) => {
			if (!action.payload) {
				return;
			}

			if (state.selectedCompaniesIds.includes(action.payload.id)) {
				return;
			}

			state.selectedCompaniesIds.push(action.payload.id);

			// update workers list
			if (Object.keys(action.payload.workersList).length) {
				const workersMap: Map<string, ItemWorker> = new Map(Object.entries(state.listedWorkers));

				Object.values(action.payload.workersList).forEach((worker) => {
					workersMap.set(worker.id, worker);

					// update workers selected list
					if (state.isAllWorkersChecked) {
						if (!state.selectedWorkersIds.includes(worker.id)) {
							state.selectedWorkersIds.push(worker.id);
						}
					}
				});
				state.listedWorkers = Object.fromEntries(workersMap);
			}
		},
		addWorkerItemSelection: (state, action: PayloadAction<ItemWorker>) => {
			if (!action.payload) {
				return;
			}
			if (state.selectedWorkersIds.includes(action.payload.id)) {
				return;
			}

			state.selectedWorkersIds.push(action.payload.id);
		},
		deleteCompanyItemSelection: (state, action: PayloadAction<ItemCompany>) => {
			if (!action.payload) {
				return;
			}

			state.selectedCompaniesIds = state.selectedCompaniesIds.filter(
				(companyId) => companyId !== action.payload.id
			);

			// update workers list
			if (Object.keys(action.payload.workersList).length) {
				Object.values(action.payload.workersList).forEach((worker) => {
					// update workers selected list
					if (state.isAllWorkersChecked) {
						state.selectedWorkersIds = state.selectedWorkersIds.filter(
							(workerId) => workerId !== worker.id
						);
					}

					delete state.listedWorkers[worker.id];
				});
			}

			// if it is no selected companies - check out checkboxAll
			if (state.selectedCompaniesIds.length === 0) {
				state.isAllCompaniesChecked = false;
			}
			// if it is no listed workers - check out checkboxAll
			if (Object.keys(state.listedWorkers).length === 0) {
				state.isAllWorkersChecked = false;
			}
		},
		deleteWorkerItemSelection: (state, action: PayloadAction<ItemWorker>) => {
			if (!action.payload) {
				return;
			}

			state.selectedWorkersIds = state.selectedWorkersIds.filter(
				(workerId) => workerId !== action.payload.id
			);

			// if it is no selected workers - check out checkboxAll
			if (state.selectedWorkersIds.length === 0) {
				state.isAllWorkersChecked = false;
			}
		},
		toggleAllWorkersCheck: (state, action: PayloadAction<boolean>) => {
			if (action.payload) {
				state.selectedWorkersIds = Object.entries(state.listedWorkers).map(
					(workerRecord) => workerRecord[0]
				);
			} else {
				state.selectedWorkersIds = [];
			}
			state.isAllWorkersChecked = action.payload;
		},
		toggleAllCompaniesCheck: (state, action: PayloadAction<boolean>) => {
			if (action.payload) {
				state.selectedCompaniesIds = [];
				state.listedWorkers = {};

				// if isAllWorkersChecked then add all workers to selectedWorkersIds
				// but at first empty selectedWorkersIds
				if (state.isAllWorkersChecked) {
					state.selectedWorkersIds = [];
				}

				Object.entries(state.listedCompanies).forEach(([companyId, company]) => {
					state.selectedCompaniesIds.push(companyId);

					if (Object.keys(company.workersList).length > 0) {
						Object.values(company.workersList).forEach((worker) => {
							state.listedWorkers[worker.id] = worker;

							// if isAllWorkersChecked then add all workers to selectedWorkersIds
							if (state.isAllWorkersChecked) {
								state.selectedWorkersIds.push(worker.id);
							}
						});
					}
				});
			} else {
				state.selectedCompaniesIds = [];
				state.listedWorkers = {};
			}
			state.isAllCompaniesChecked = action.payload;

			// if it is no listed workers - check out checkboxAll
			if (Object.keys(state.listedWorkers).length === 0) {
				state.selectedWorkersIds = [];
				state.isAllWorkersChecked = false;
			}
		},
		deleteSelectedCompaniesItems: (state) => {
			if (state.selectedCompaniesIds.length > 0) {
				state.selectedCompaniesIds.forEach((companyId) => {
					delete state.listedCompanies[companyId];
				});
				state.listedWorkers = {};
				state.selectedCompaniesIds = [];
				state.selectedWorkersIds = [];
			}
		},
		deleteSelectedWorkersItems: (state) => {
			if (state.selectedWorkersIds.length > 0) {
				state.selectedWorkersIds.forEach((workerId) => {
					const workerToDelete = state.listedWorkers[workerId];
					const relatedCompany = state.listedCompanies[workerToDelete.employer];
					// delete selected workers from company
					delete relatedCompany.workersList[workerId];
					// update companyes quantity workers
					relatedCompany.workersQuantity = Object.keys(relatedCompany.workersList).length;
					// and delete worker from list
					delete state.listedWorkers[workerId];
				});
				//reset selectedWorkersIds to empty
				state.selectedWorkersIds = [];
			}
		},
		createNewCompany: (
			state,
			action: PayloadAction<{
				name: string;
				quantity: number;
				address: string;
				isWorkersDataInputs: boolean;
				workersData: Record<string, InitialWorkerData>;
				isWorkersDataCsv: boolean;
				workersCsvData: InitialWorkerData[];
			}>
		) => {
			const {
				name,
				quantity,
				address,
				isWorkersDataInputs,
				workersData,
				isWorkersDataCsv,
				workersCsvData
			} = action.payload;

			// generate company id
			const companyId = `c${uuid()}`;

			const newCompany: ItemCompany = {
				id: companyId,
				companyName: name,
				address: address,
				workersQuantity: quantity,
				workersList: {}
			};

			if (isWorkersDataInputs) {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				Object.entries(workersData).forEach(([worker_marker, { surname, name, role }]) => {
					// generate worker id
					const workerId = `w${uuid()}`;

					const newWorker: ItemWorker = {
						id: workerId,
						surname,
						name,
						role,
						employer: companyId
					};

					newCompany.workersList[workerId] = newWorker;
				});
			}

			if (isWorkersDataCsv) {
				workersCsvData.forEach(({ surname, name, role }) => {
					// generate worker id
					const workerId = `w${uuid()}`;

					const newWorker: ItemWorker = {
						id: workerId,
						surname,
						name,
						role,
						employer: companyId
					};

					newCompany.workersList[workerId] = newWorker;
				});
			}

			// update number after all workers lists merges
			newCompany.workersQuantity = Object.keys(newCompany.workersList).length;

			state.listedCompanies[companyId] = newCompany;
		},
		injectWorkersToExistedCompany: (
			state,
			action: PayloadAction<{
				employerCompanyId: string;
				isWorkersDataInputs: boolean;
				workersData: Record<string, InitialWorkerData>;
				isWorkersDataCsv: boolean;
				workersCsvData: InitialWorkerData[];
			}>
		) => {
			const {
				employerCompanyId,
				isWorkersDataInputs,
				workersData,
				isWorkersDataCsv,
				workersCsvData
			} = action.payload;

			const injectionWithWorkers = {
				workersList: {} as Record<string, ItemWorker>
			};

			if (isWorkersDataInputs) {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				Object.entries(workersData).forEach(([worker_marker, { surname, name, role }]) => {
					// generate worker id
					const workerId = `w${uuid()}`;

					const newWorker: ItemWorker = {
						id: workerId,
						surname,
						name,
						role,
						employer: employerCompanyId
					};

					injectionWithWorkers.workersList[workerId] = newWorker;
				});
			}

			if (isWorkersDataCsv) {
				workersCsvData.forEach(({ surname, name, role }) => {
					// generate worker id
					const workerId = `w${uuid()}`;

					const newWorker: ItemWorker = {
						id: workerId,
						surname,
						name,
						role,
						employer: employerCompanyId
					};

					injectionWithWorkers.workersList[workerId] = newWorker;
				});

				//determine existed company to workers injection
				const companyToInjection = state.listedCompanies[employerCompanyId];
				// merge existed company workersList with injection
				companyToInjection.workersList = Object.assign(
					{},
					companyToInjection.workersList,
					injectionWithWorkers.workersList
				);

				// update workers quantity
				companyToInjection.workersQuantity = Object.keys(companyToInjection.workersList).length;
			}
		},
		deselectAllCompanyItems: (store) => {
			store.selectedCompaniesIds = [];
		},
		deselectAllWorkersItems: (store) => {
			store.selectedWorkersIds = [];
		}
	}
});

export const {
	addCompanyItemSelection,
	addWorkerItemSelection,

	deleteCompanyItemSelection,
	deleteWorkerItemSelection,

	toggleAllWorkersCheck,
	toggleAllCompaniesCheck,

	deleteSelectedCompaniesItems,
	deleteSelectedWorkersItems,

	createNewCompany,
	injectWorkersToExistedCompany,

	deselectAllCompanyItems,
	deselectAllWorkersItems
} = mockDataSlice.actions;
export default mockDataSlice.reducer;
