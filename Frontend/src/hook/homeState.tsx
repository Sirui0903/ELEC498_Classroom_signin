import { useAppDispatch, useAppSelector } from './state';
import {
  getPermission,
  getUserName,
  selectUserId,
} from '../store/slices/homeState';
import React from 'react';
import { IHomeState } from '../settings/homeState';

export function useUsers() {
  const uid = useAppSelector(selectUserId);
  const permission = useAppSelector(getPermission);
  const user_name = useAppSelector(getUserName);

  const usersInfo: IHomeState = React.useMemo(() => {
    return { uid, permission, user_name };
  }, [uid, permission, user_name]);

  return usersInfo;
}
