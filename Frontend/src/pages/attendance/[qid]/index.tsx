import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import BaseLayout from '../../../layout/baseLayout';
import { useEffect, useState } from 'react';
import { getSignMessage } from '../../../api/sing';
import { ErrorMessage } from '../../../lib/messages';
import { Qrcode } from '../../../components/qrcode';
import Typography from '@mui/material/Typography';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import * as React from 'react';
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx';

const DetailedInformation = () => {
  const router = useRouter();
  const qid = router.query.qid as string;
  const [parma, setParma] = useState<{ _id: string; user_name: string }[]>([]);

  useEffect(() => {
    if (!qid) return;
    getSignMessage({ qid })
      .then((res) => {
        setParma(res.data);
      })
      .catch(ErrorMessage);
  }, [qid]);

  const handleExport = () => {
    const data = [
      ['Id', 'Username'],
      ...parma.map((item, index) => [{ v: index + 1 }, { v: item.user_name }]),
    ];
    // 创建一个工作簿
    const wb = XLSX.utils.book_new();
    // 创建一个工作表
    const ws = XLSX.utils.aoa_to_sheet(data);
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // 保存工作簿为Excel文件
    XLSX.writeFile(wb, 'Class_Attendance_Sheet.xlsx');
  };

  return (
    <BaseLayout>
      <Box height={'100%'} sx={{ padding: '1rem' }}>
        <Box
          sx={{
            height: '100%',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0,0.5)',
            padding: '2rem',
          }}
        >
          {qid && (
            <Box
              sx={{
                textAlign: 'center',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                width: '200px',
                margin: 'auto', // 居中
                mb: '5rem',
              }}
            >
              <Typography variant="h6">Check-in QR Code</Typography>
              <Qrcode content={qid} />
              <Typography variant="body2">
                Scan the QR code to check in
              </Typography>
            </Box>
          )}
          {parma.length !== 0 ? (
            <Box>
              <Box mb={'1rem'}>
                <Button variant={'contained'} onClick={handleExport}>
                  Export
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Id</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        Username
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parma.map((row, index) => (
                      <TableRow key={row._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.user_name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body1" sx={{ textAlign: 'center' }}>
                No attendance information at the moment
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </BaseLayout>
  );
};

export default DetailedInformation;
