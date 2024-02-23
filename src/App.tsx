// import { useState } from 'react';
import './App.css';
import { List } from './components/List/List';
// import { COMPANIES_MOCK } from './mock';
import { useSelector } from 'react-redux';
import { ItemCompany, ItemWorker } from './components/ItemRow/ItemRow.props';
import { RootState } from './store';
import { CompaniesList } from './components/CompaniesList/CompaniesList';
import { WorkersList } from './components/WorkersList/WorkersList';
// import { COMPANIES_MOCK, WORKERS_MOCK } from './mock';

function App() {
	const listedCompanies = useSelector((state: RootState) => state.mockData.listedCompanies);

	const companiesArray: ItemCompany[] = Object.entries(listedCompanies).map((entry) => entry[1]);

	const listedWorkers = useSelector((state: RootState) => state.mockData.listedWorkers);

	const workersArray: ItemWorker[] = Object.entries(listedWorkers).map((entry) => entry[1]);

	console.log(`listedCompanies`);
	console.log(listedCompanies);

	console.log(`listedWorkers`);
	console.log(listedWorkers);

	if (listedWorkers instanceof Map) {
		console.log('listedWorkers объект Map.');
	} else {
		console.log('listedWorkers не объект Map.');
	}

	return (
		<>
			<h1 className="header">Список компаний</h1>
			<div className="app">
				<div className="table">
					<div className="table__column">
						{companiesArray.length > 0 ? (
							<>
								{/* <List items={companiesArray} /> */}
								<CompaniesList items={companiesArray} />
							</>
						) : (
							<p className="table__notification">список компаний пуст</p>
						)}
					</div>
					<div className="table__column">
						{workersArray.length > 0 ? (
							<>
								{/* <List items={workersArray} /> */}
								<WorkersList items={workersArray} />
							</>
						) : (
							<p className="table__notification">список сотрудников пуст</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
