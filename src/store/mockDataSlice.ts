// mockDataSlice.js

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CreateCompaniesMockList } from '../mock';
import { ItemCompany, ItemWorker } from '../components/ItemRow/ItemRow.props';

const COMPANIES_MOCK = CreateCompaniesMockList(Math.round(Math.random() * 20));

interface MockDataState {
	companiesMock: ItemCompany[];
	selectedCompanies: ItemCompany[];
	// listedWorkers: ItemWorker[];
	listedWorkers: Record<string, ItemWorker>;
}

const initialState: MockDataState = {
	companiesMock: COMPANIES_MOCK, // ваш начальный стейт для компаний
	selectedCompanies: [],
	// listedWorkers: []
	listedWorkers: {}
};

const mockDataSlice = createSlice({
	name: 'mockData',
	initialState,
	reducers: {
		setCompaniesMock: (state, action) => {
			state.companiesMock = action.payload;
		},
		addCompanyItemSelection: (state, action: PayloadAction<ItemCompany>) => {
			if (!action.payload) {
				return;
			}
			if (state.selectedCompanies.some((company) => company.id === action.payload.id)) {
				return;
			}

			state.selectedCompanies.push(action.payload);

			if (action.payload.workersList.length) {
				// 	state.listedWorkers = state.listedWorkers.concat(action.payload.workersList);

				// 	const workersMap: Record<string, ItemWorker> = {};

				// 	action.payload.workersList.forEach((worker) => {
				// 		workersMap[worker.id] = worker;
				// 	});
				// 	// state.listedWorkers = { ...state.listedWorkers, ...workersMap };
				// 	state.listedWorkers = { ...state.listedWorkers, ...workersMap };

				// const workersMap: Map<string, ItemWorker> = new Map(state.listedWorkers);
				// action.payload.workersList.forEach((worker) => {
				// 	workersMap.set(worker.id, worker);
				// });
				// state.listedWorkers = workersMap;

				const workersMap: Map<string, ItemWorker> = new Map(Object.entries(state.listedWorkers));
				console.log(`workersMap`);
				console.log(workersMap);

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
			state.selectedCompanies = state.selectedCompanies.filter(
				(company) => company.id !== action.payload.id
			);

			if (action.payload.workersList.length) {
				const idsToRemove = action.payload.workersList.map((worker) => worker.id);
				// state.listedWorkers = { ...state.listedWorkers };
				idsToRemove.forEach((id) => {
					delete state.listedWorkers[id];
				});
			}
		}
		// другие редукторы
	}
});

export const { setCompaniesMock, addCompanyItemSelection, deleteCompanyItemSelection } =
	mockDataSlice.actions;
export default mockDataSlice.reducer;
