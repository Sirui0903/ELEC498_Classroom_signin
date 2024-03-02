import { Box } from '@mui/system';

import { useState } from 'react';
import {
  Paper,
  Button,
  Dialog,
  TextField,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  MenuItem,
  Select,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { createClass } from '../../api/class';
import { ErrorMessage } from '../../lib/messages';
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import { editUserClass } from '../../api/user';

export const ClassBase = (props: any) => {
  const [classData, setClassData] = useState(props.classData);
  const [userData, setUserData] = useState(props.userData);
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState('Class-1');
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectUid, setSelectUid] = useState('');
  const [selectCid, setSelectCid] = useState('');
  const handleAddClass = () => {
    createClass(className)
      .then((res) => {
        if (res) {
          setClassData(res.data);
          alert('success');
        }
      })
      .catch(ErrorMessage);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleListClose = () => {
    setSelectUid('');
    setIsListOpen(false);
    setSelectCid('');
  };

  const handleListOpen = (_id: string, classId: string) => {
    setSelectUid(_id);
    setIsListOpen(true);
    setSelectCid(classId);
  };
  const handleAssign = () => {
    const res = classData.filter((item: any) => {
      return item.content === selectedOption;
    });
    const { _id } = res[0];
    editUserClass({ uid: selectUid, cid: _id, oldCid: selectCid })
      .then((res) => {
        handleListClose();
        alert('Success');
      })
      .catch(ErrorMessage);
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 上半部分 */}
      <Paper
        elevation={3}
        style={{
          padding: '10px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
          overflow: 'auto', // 添加 overflow 属性
          height: '40%', // 设置高度为50%
          margin: '10px',
        }}
      >
        <Typography variant="h5" display={'inline'} mr={'1rem'}>
          Class Information Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDialogOpen}
          size={'small'}
        >
          Add Class
        </Button>
        {classData.length !== 0 ? (
          <Box>
            <Table sx={{ width: '100%' }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Id</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    Class Name&nbsp;
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    Total Number of Students&nbsp;
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classData.map(
                  (
                    row: { _id: string; content: string; users: string[] },
                    index: number,
                  ) => (
                    <TableRow key={row._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.content}</TableCell>
                      <TableCell>{row.users.length}</TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </Box>
        ) : (
          <Box
            sx={{
              height: '90%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body1">
              Currently no classes have been created.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* 下半部分 */}
      <Paper
        elevation={3}
        style={{
          flex: 1,
          margin: '10px',
          padding: '10px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
          overflow: 'auto', // 添加 overflow 属性
          // height: '40%', // 设置高度为50%
        }}
      >
        <Typography variant="h5">Student Information</Typography>
        {userData.data.leng === 0 ? (
          <Box
            sx={{
              height: '80%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body1">
              The current student information has not been created.
            </Typography>
          </Box>
        ) : (
          <Box>
            <Table sx={{ width: '100%' }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Id</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    Username&nbsp;
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Class&nbsp;</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    Assign&nbsp;
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userData.data.map(
                  (
                    row: { user_name: string; class: string; _id: string },
                    index: number,
                  ) => (
                    <TableRow key={row._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.user_name}</TableCell>
                      <TableCell>
                        {row.class
                          ? classData.find(
                              (item: any) => item._id === row.class,
                            ).content
                          : 'Not assigned'}
                      </TableCell>
                      <TableCell
                        sx={{ color: '#ff9800', cursor: 'pointer' }}
                        onClick={() => handleListOpen(row._id, row.class)}
                      >
                        Assign
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>

      <Dialog open={isListOpen} onClose={handleListClose}>
        <Box p={2} width={300}>
          <Typography variant="h6">Assign Class</Typography>
          <FormControl fullWidth margin="normal">
            <Select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              {/* Your list of classes */}
              {classData.map((cls: any) => (
                <MenuItem key={cls._id} value={cls.content}>
                  {cls.content}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAssign}
            sx={{ mt: '1rem' }}
            disabled={!selectedOption}
          >
            Assign
          </Button>
        </Box>
      </Dialog>

      <Dialog open={open} onClose={handleDialogClose}>
        <Box p={2}>
          <Typography variant="h6">Enter Class Name</Typography>
          <TextField
            label="Class Name"
            fullWidth
            margin="normal"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleDialogClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddClass}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};
