import { Box } from '@mui/system';
import style from '../lib/main.module.scss';
import { useUsers } from '../../hook/homeState';

export default function Main() {
  const use = useUsers();
  const { permission } = use;
  return (
    <Box className={style.bgi}>
      {permission === 'admin' ? (
        <Box>Welcome to the instructor Dashboard</Box>
      ) : (
        <Box>Welcome to the student Dashboard</Box>
      )}
    </Box>
  );
}
