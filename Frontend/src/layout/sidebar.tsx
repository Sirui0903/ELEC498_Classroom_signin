import { Box } from '@mui/system';
import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Sidebar: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Box />
      <main>{children}</main>
      <Box />
    </>
  );
};

export default Sidebar;
