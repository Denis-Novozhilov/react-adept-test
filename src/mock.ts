import { ItemCompany, ItemWorker } from './types/types';
import { v4 } from 'uuid';

export const CreatelistedCompaniesList = (quantity: number = 3): ItemCompany[] => {
	return Array.from({ length: quantity }, () => {
		const stamp = v4();
		const workersQuantity = Math.round(Math.random() * 10);
		const res = {
			id: `c${stamp}`,
			companyName: `companyName_${stamp}`,
			address: `address_${stamp}`,
			workersQuantity: workersQuantity,
			workersList: CreateWorkersMockList(workersQuantity, `c${stamp}`)
		};
		return res;
	});
};

const CreateWorkersMockList = (
	quantity: number = 3,
	relation = '_empty_relation'
): Record<string, ItemWorker> => {
	const res: Record<string, ItemWorker> = {};
	for (let i = 0; i < quantity; i++) {
		const stamp = v4();
		const workerStamp = `w${stamp}`;
		res[workerStamp] = {
			id: workerStamp,
			surname: `surname_${stamp}`,
			name: `name_${stamp}`,
			role: `role_${stamp}`,
			employer: relation
		};
	}
	return res;
};

// export const COMPANIES_MOCK = CreatelistedCompaniesList(Math.round(Math.random() * 20));

// export const COMPANIES_MOCK: ItemCompany[] = [
// 	{
// 		id: 'c1',
// 		companyName: 'Компания1',
// 		workersQuantity: 10,
// 		address: 'Адрес 1',
// 		workersList: CreateWorkersMockList(2)
// 	},
// 	{
// 		id: 'c2',
// 		companyName: 'Компания2',
// 		workersQuantity: 11,
// 		address: 'Адрес 2',
// 		workersList: CreateWorkersMockList(3)
// 	},
// 	{
// 		id: 'c3',
// 		companyName: 'Компания3',
// 		workersQuantity: 12,
// 		address: 'Адрес 3',
// 		workersList: CreateWorkersMockList(4)
// 	},
// 	{
// 		id: 'c4',
// 		companyName: 'Компания4',
// 		workersQuantity: 13,
// 		address: 'Адрес 4',
// 		workersList: CreateWorkersMockList(5)
// 	},
// 	{
// 		id: 'c5',
// 		companyName: 'Компания5',
// 		workersQuantity: 13,
// 		address: 'Адрес 5',
// 		workersList: CreateWorkersMockList(6)
// 	}
// ];
// export const WORKERS_MOCK: ItemWorker[] = [
// 	{
// 		id: 'w1',
// 		surname: 'surname1',
// 		name: 'name1',
// 		role: 'role1'
// 	},
// 	{
// 		id: 'w2',
// 		surname: 'surname2',
// 		name: 'name2',
// 		role: 'role2'
// 	},
// 	{
// 		id: 'w3',
// 		surname: 'surname3',
// 		name: 'name3',
// 		role: 'role3'
// 	}
// ];
