export interface IHomeState {
  uid: string | null;
  permission: string | null;
  user_name: string;
}
export type IHomePermission = 'admin' | 'common';
export const homePermission: {
  admin: IHomePermission;
  common: IHomePermission;
} = {
  admin: 'admin',
  common: 'common',
};
export const homeStateDefault: IHomeState = {
  uid: null,
  permission: null,
  user_name: '',
};
