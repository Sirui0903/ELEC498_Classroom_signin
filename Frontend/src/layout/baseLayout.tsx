import { Box } from '@mui/material';
import Navigation from '../components/navigation/navigation';
import LeftOrder from '../components/leftorder/leftorder';
import { ReactNode, useEffect } from 'react';
import { useAppDispatch } from '../hook/state';
import { getUserData } from '../lib/public/storage';
import { updateUserInfoReducer } from '../store/slices/homeState';

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      dispatch(updateUserInfoReducer(userData));
    }
  }, [dispatch]);
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Box>
          {/* 左侧导航栏 */}
          <LeftOrder />
        </Box>
        <Box sx={{ flex: 1 }}>
          {/* 主要内容 */}
          <main style={{ height: '100%' }}>{children}</main>
        </Box>
      </Box>
    </Box>
  );
};

export default BaseLayout;
