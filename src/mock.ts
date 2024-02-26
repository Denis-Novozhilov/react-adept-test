import { uuid } from './helpers/customUuid';
import { ItemCompany, ItemWorker } from './types/types';

export const CreatelistedCompaniesList = (quantity: number = 3): ItemCompany[] => {
	return Array.from({ length: quantity }, () => {
		const stamp = uuid();
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
		const stamp = uuid();
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
