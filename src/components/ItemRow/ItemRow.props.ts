export interface ItemCompany {
	id: string;
	companyName: string;
	address: string;
	workersQuantity: number;
	workersList: ItemWorker[];
}
export interface ItemWorker {
	id: string;
	surname: string;
	name: string;
	role: string;
}
