import { ItemWorker } from '../WorkerItem/WorkerItem.props';

export interface ItemCompany {
	id: string;
	companyName: string;
	address: string;
	workersQuantity: number;
	workersList: ItemWorker[];
}
