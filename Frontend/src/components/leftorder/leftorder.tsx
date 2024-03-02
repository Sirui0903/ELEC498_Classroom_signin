import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/router';
import { useUsers } from '../../hook/homeState';
import { homePermission } from '../../settings/homeState';
import SchoolIcon from '@mui/icons-material/School';
import HomeIcon from '@mui/icons-material/Home';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AssignmentIcon from '@mui/icons-material/Assignment';

function LeftOrder() {
  const users = useUsers();
  const { uid, permission } = users;
  let orders = [{ value: 'Main', path: '' }];
  if (uid && permission === homePermission.admin) {
    orders = [
      { value: 'Main', path: '' },
      { value: 'Attendance information', path: 'attendance' },
      { value: 'Students Management', path: 'student' },
      { value: 'Class Management', path: 'class' },
    ];
  }
  const router = useRouter();

  const handleClick = (value: string) => {
    const sanitizedValue = value.replace(/^\/+/, '');
    router.push(`/${sanitizedValue}`);
  };

  return (
    <Box
      minWidth={'15rem'}
      height="100%"
      sx={{ padding: '1rem', backgroundColor: 'rgb(255, 149, 0)' }}
    >
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          color: 'white',
          borderRadius: '10px', // 调整为你希望的圆角大小
          boxShadow: '0 4px 8px rgba(0, 0, 0,0.5)', // 调整为你希望的阴影效果
        }}
      >
        {orders.map((item, index) => (
          <ListItem key={item.value}>
            <ListItemButton
              onClick={() => {
                handleClick(item.path);
              }}
            >
              <Box sx={{ display: 'inline', mr: '1rem' }}>
                {item.path === '' ? (
                  <HomeIcon />
                ) : item.path === 'attendance' ? (
                  <AssignmentIcon />
                ) : item.path === 'class' ? (
                  <SchoolIcon />
                ) : (
                  <BookmarkIcon />
                )}
              </Box>
              <ListItemText primary={item.value} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default LeftOrder;
