export interface ItemCompany {
	id: string;
	companyName: string;
	address: string;
	workersQuantity: number;
	// workersList: ItemWorker[];
	workersList: Record<string, ItemWorker>;
}
export interface ItemWorker {
	id: string;
	surname: string;
	name: string;
	role: string;
	employer: string;
}

export interface InitialWorkerData {
	surname: string;
	name: string;
	role: string;
}
