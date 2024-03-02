import * as React from 'react';
import { Box } from '@mui/system';
import { parseISO, format } from 'date-fns';
import Typography from '@mui/material/Typography';
import {
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getUserData } from '../../lib/public/storage';
import { getNewSign } from '../../api/sing';
import { ErrorMessage } from '../../lib/messages';
import { useUsers } from '../../hook/homeState';
import Link from '@mui/material/Link';

export function Attendance() {
  const [param, setParam] = useState<{
    data: any;
    totalPages: number;
    totalCount: number;
    currentPage: number;
    _id: string;
    signs: any[];
  } | null>(null);

  const user = useUsers();
  useEffect(() => {
    let isMounted = true; // 添加一个标志以检测组件是否已挂载
    const userData = getUserData();
    if (!userData) return;
    const { uid } = userData;
    const fetchData = async () => {
      const result = await getNewSign({ cid: uid });
      if (isMounted) {
        setParam(result.data);
      }
    };
    fetchData().catch((error: any) => {
      ErrorMessage(error);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  let newData: any[] = [];
  if (!!param) {
    const currentDate = new Date();
    newData = param.data.map((item: any, index: number) => {
      return {
        id: index + 1,
        limit: format(item.limit, 'yyyy-MM-dd HH:mm:ss'),
        toc: format(item.toc, 'yyyy-MM-dd HH:mm:ss'),
        status:
          new Date(item.limit).getTime() > currentDate.getTime()
            ? 'underway'
            : 'overtime',
        qid: item._id,
        total: item.signs.length,
      };
    });
  }

  const changePage = async (page: number) => {
    if (!user.uid) return;
    const res = await getNewSign({ cid: user.uid, currentPage: page });
    setParam(res.data);
  };

  return (
    <Box height={'100%'} sx={{ padding: '1rem' }}>
      <Box
        height={'100%'}
        sx={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0,0.5)' }}
      >
        {newData.length === 0 ? (
          <Box>
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: 'gray',
                fontStyle: 'italic',
                textAlign: 'center',
                fontWeight: 'bold', // 加粗
                fontSize: '1.2rem', // 调整字体大小
              }}
            >
              No data currently available
            </Typography>
          </Box>
        ) : (
          <Box height={'90%'} sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <TableContainer
              component={Paper}
              style={{
                height: '100%',
                borderRadius: 'none',
                boxShadow: 'none',
              }}
            >
              <Table sx={{ width: '100%' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Id</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Attendance count&nbsp;
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Limit&nbsp;
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Creation time&nbsp;
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Status&nbsp;
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Particulars&nbsp;
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {newData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.total}</TableCell>
                      <TableCell>{row.limit}</TableCell>
                      <TableCell>{row.toc}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>
                        <Link href={`/attendance/${row.qid}`}>Leave for</Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {!!param && (
              <Box
                sx={{
                  height: '10%',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Pagination
                  count={param.totalPages}
                  color="primary"
                  page={Number(param.currentPage)}
                  onChange={(event, page) => {
                    changePage(page);
                  }}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
