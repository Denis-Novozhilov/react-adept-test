import './App.css';
import { useSelector } from 'react-redux';
import { CompaniesList } from './components/CompaniesList/CompaniesList';
import { ItemCompany, ItemWorker } from './types/types';
import { WorkersList } from './components/WorkersList/WorkersList';
import { RootState } from './store';
// import VirtualizedList from './components/VirtualizedList/VirtualizedList';

function App() {
	const listedCompanies = useSelector((state: RootState) => state.mockData.listedCompanies);
	const companiesArray: ItemCompany[] = Object.entries(listedCompanies).map((entry) => entry[1]);

	const listedWorkers = useSelector((state: RootState) => state.mockData.listedWorkers);
	const workersArray: ItemWorker[] = Object.entries(listedWorkers).map((entry) => entry[1]);

	return (
		<>
			<div className="app">
				<div className="table">
					<h2 className="header">Список компаний</h2>
					<div className="table__column">
						<CompaniesList items={companiesArray} />
					</div>
				</div>
				<div className="table">
					<h2 className="header">Список сотрудников</h2>
					<div className="table__column">
						<WorkersList items={workersArray} />
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
