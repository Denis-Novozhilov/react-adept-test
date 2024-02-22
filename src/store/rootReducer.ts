import { combineReducers } from '@reduxjs/toolkit';
import mockDataReducer from './mockDataSlice';

console.log(`mockDataReducer↓`);
console.log(mockDataReducer);
console.log(`mockDataReducer↑`);

const rootReducer = combineReducers({
	mockData: mockDataReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
