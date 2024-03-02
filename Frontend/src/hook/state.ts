import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { AppDispatch, AppState } from '../store/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
