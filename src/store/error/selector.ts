import { RootState } from '../store';
import { ErrorSlice } from './types';

export const selectError = (state: RootState): ErrorSlice => state.error;