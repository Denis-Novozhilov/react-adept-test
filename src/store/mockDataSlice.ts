// mockDataSlice.js

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CreatelistedCompaniesList } from '../mock';
import { ItemCompany, ItemWorker } from '../components/ItemRow/ItemRow.props';

const COMPANIES_MOCK = CreatelistedCompaniesList(Math.round(Math.random() * 20));
const companiesInitialMap: Map<string, ItemCompany> = new Map();
COMPANIES_MOCK.forEach((company) => {
	companiesInitialMap.set(company.id, company);
});

interface MockDataState {
	isAllCompaniesChecked: boolean;
	isAllWorkersChecked: boolean;
	listedCompanies: Record<string, ItemCompany>;
	// selectedCompanies: Record<string, ItemCompany>;
	selectedCompaniesIds: string[];
	listedWorkers: Record<string, ItemWorker>;
}

const initialState: MockDataState = {
	// listedCompanies: COMPANIES_MOCK, // ваш начальный стейт для компаний
	listedCompanies: Object.fromEntries(companiesInitialMap), // ваш начальный стейт для компаний

	isAllCompaniesChecked: false,
	isAllWorkersChecked: false,
	// selectedCompanies: {},
	selectedCompaniesIds: [],

	listedWorkers: {}
};

const mockDataSlice = createSlice({
	name: 'mockData',
	initialState,
	reducers: {
		setlistedCompanies: (state, action) => {
			state.listedCompanies = action.payload;
		},
		addCompanyItemSelection: (state, action: PayloadAction<ItemCompany>) => {
			if (!action.payload) {
				return;
			}
			// if (state.selectedCompanies[action.payload.id]) {
			// 	return;
			// }
			if (state.selectedCompaniesIds.includes(action.payload.id)) {
				return;
			}

			// state.selectedCompanies[action.payload.id] = action.payload;

			state.selectedCompaniesIds.push(action.payload.id);

			// update workers list
			if (action.payload.workersList.length) {
				const workersMap: Map<string, ItemWorker> = new Map(Object.entries(state.listedWorkers));

				action.payload.workersList.forEach((worker) => {
					workersMap.set(worker.id, worker);
				});
				state.listedWorkers = Object.fromEntries(workersMap);
			}
		},
		deleteCompanyItemSelection: (state, action: PayloadAction<ItemCompany>) => {
			if (!action.payload) {
				return;
			}

			// delete state.selectedCompanies[action.payload.id];

			state.selectedCompaniesIds = state.selectedCompaniesIds.filter(
				(companyId) => companyId !== action.payload.id
			);

			// update workers list
			if (action.payload.workersList.length) {
				action.payload.workersList.forEach((worker) => {
					delete state.listedWorkers[worker.id];
				});
			}

			// if it is no selected companies - check out checkboxAll
			if (state.selectedCompaniesIds.length === 0) {
				state.isAllCompaniesChecked = false;
			}
		},
		toggleAllWorkersCheck: (state, action: PayloadAction<boolean>) => {
			state.isAllWorkersChecked = action.payload;
		},
		toggleAllCompaniesCheck: (state, action: PayloadAction<boolean>) => {
			if (action.payload) {
				state.selectedCompaniesIds = [];
				state.listedWorkers = {};

				Object.entries(state.listedCompanies).forEach(([companyId, company]) => {
					state.selectedCompaniesIds.push(companyId);

					if (company.workersList.length > 0) {
						company.workersList.forEach((worker) => {
							state.listedWorkers[worker.id] = worker;
						});
					}
				});
			} else {
				state.selectedCompaniesIds = [];
				state.listedWorkers = {};
			}
			state.isAllCompaniesChecked = action.payload;
		}
		// другие редукторы
	}
});

export const {
	setlistedCompanies,
	addCompanyItemSelection,
	deleteCompanyItemSelection,
	toggleAllWorkersCheck,
	toggleAllCompaniesCheck
} = mockDataSlice.actions;
export default mockDataSlice.reducer;
