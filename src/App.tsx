// import { useState } from 'react';
import './App.css';
import { List } from './components/List/List';
// import { COMPANIES_MOCK } from './mock';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { ItemWorker } from './components/ItemRow/ItemRow.props';
// import { COMPANIES_MOCK, WORKERS_MOCK } from './mock';

function App() {
	const companiesMock = useSelector((state: RootState) => state.mockData.companiesMock);
	// const listedWorkers = useSelector((state: RootState) => state.mockData.listedWorkers);
	const listedWorkers = useSelector((state: RootState) => state.mockData.listedWorkers);
	// const workersArray: ItemWorker[] = Array.from(listedWorkers.values());
	// const workersArray: any = Array.from(listedWorkers.values());
	// const workersArray: any = listedWorkers;

	// const workersArray: ItemWorker[] = Array.from(listedWorkers.values());
	const workersArray: ItemWorker[] = Object.entries(listedWorkers).map((entry) => entry[1]);

	// console.log(`workersArray`);
	// console.log(workersArray);
	// console.log(`Object.entries(workersArray)`);
	// console.log(Object.entries(workersArray));
	// console.log(`typeof workersArray`);
	// console.log(typeof workersArray);
	// console.log(`companiesMock`);
	// console.log(companiesMock);
	// const [count, setCount] = useState(0);

	return (
		<>
			<h1 className="header">Список компаний</h1>
			<div className="app">
				<div className="table">
					<div className="table__column">
						<List items={companiesMock} />
						{/* <List items={[]} /> */}
					</div>
					<div className="table__column">
						{/* <List items={WORKERS_MOCK} /> */}
						{workersArray.length > 0 ? (
							<List items={workersArray} />
						) : (
							<p className="table__notification">список сотрудников пуст</p>
						)}
						{/* <List items={[]} /> */}
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
