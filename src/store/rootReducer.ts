import { combineReducers } from '@reduxjs/toolkit';
import mockDataReducer from './mockDataSlice';

const rootReducer = combineReducers({
	mockData: mockDataReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
