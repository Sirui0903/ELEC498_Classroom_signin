import { Box } from '@mui/system';

import { useRef, useState } from 'react';
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
  Checkbox,
  OutlinedInput,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { createClass, deleteClass, editClassName } from '../../api/class';
import { ErrorMessage } from '../../lib/messages';
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import { editUserClass } from '../../api/user';
import ListItemText from '@mui/material/ListItemText';

export const ClassBase = (props: any) => {
  const [classData, setClassData] = useState(props.classData);
  const [userData, setUserData] = useState(props.userData);
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState('Class-1');
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectEditObj, setSelectEditObj] = useState<{
    content: string;
    _id: string;
  } | null>(null);
  const selectUidRef = useRef('');
  const handleAddClass = () => {
    createClass(className)
      .then((res) => {
        if (res) {
          setClassData(res.data);
          setOpen(false);
        }
      })
      .catch((error) => {
        setOpen(false);
        ErrorMessage(error);
      });
  };

  const handleEdit = async () => {
    if (!selectEditObj) return;
    const { _id, content } = selectEditObj;
    editClassName(selectEditObj)
      .then(() => {
        const updatedData = classData.map((item: any) => {
          if (item._id === _id) {
            return { ...item, content: content };
          }
          return item;
        });
        setClassData(updatedData);
        handleEditClose();
      })
      .catch(ErrorMessage);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectEditObj(null);
  };
  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleListClose = () => {
    setIsListOpen(false);
    setSelectedOption([]);
    selectUidRef.current = '';
  };

  const handleListOpen = (_id: string) => {
    setIsListOpen(true);
    selectUidRef.current = _id;
  };
  const handleAssign = () => {
    if (!selectUidRef.current) return;
    if (!selectedOption.length) {
      handleListClose();
      return ErrorMessage('The current content cannot be empty');
    }
    editUserClass({ uid: selectUidRef.current, cid: selectedOption })
      .then((res) => {
        const { data } = res;
        const { classData, userData } = data;
        setClassData(classData);
        setUserData(userData);
        handleListClose();
      })
      .catch((error) => {
        handleListClose();
        ErrorMessage(error);
      });
  };

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSelectedOption(typeof value === 'string' ? value.split(',') : value);
  };
  const editClass = (_id: string) => {
    const content = classData.find((item: any) => item._id === _id).content;
    setSelectEditObj({ content, _id });
    setEditOpen(true);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleDelete = async (_id: string) => {
    if (confirm('Are you sure to delete it?')) {
      deleteClass({ cid: _id })
        .then((res) => {
          const { data } = res;
          const { classData, userData } = data;
          setClassData(classData);
          setUserData(userData);
        })
        .catch(ErrorMessage);
    }
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
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    Operation&nbsp;
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
                      <TableCell>
                        <span
                          style={{
                            marginRight: '1rem',
                            color: 'rgb(252, 85, 49)',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleDelete(row._id)}
                        >
                          Delete
                        </span>
                        <span
                          style={{
                            color: 'rgb(71, 148, 255)',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            editClass(row._id);
                          }}
                        >
                          Edit
                        </span>
                      </TableCell>
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
                    row: { user_name: string; class: string[]; _id: string },
                    index: number,
                  ) => (
                    <TableRow key={row._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.user_name}</TableCell>
                      <TableCell>
                        {row.class.length
                          ? row.class.join(',')
                          : 'Not assigned'}
                      </TableCell>
                      <TableCell
                        sx={{ color: '#ff9800', cursor: 'pointer' }}
                        onClick={() => handleListOpen(row._id)}
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
              multiple
              value={selectedOption}
              onChange={handleChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => {
                return classData
                  .filter((item: any) => {
                    // @ts-ignore
                    return selected.includes(item._id);
                  })
                  .map((item: any) => item.content)
                  .join(',');
              }}
              MenuProps={MenuProps}
            >
              {classData.map((cls: any) => (
                <MenuItem key={cls._id} value={cls._id}>
                  <Checkbox
                    checked={
                      // @ts-ignore
                      selectedOption.indexOf(cls._id) > -1
                    }
                  />
                  <ListItemText primary={cls.content} />
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
          <Box mt={2} display="flex" justifyContent={'space-around'}>
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

      <Dialog open={editOpen} onClose={handleEditClose}>
        <Box p={2}>
          <Typography variant="h6">Edit Class Name</Typography>
          <TextField
            fullWidth
            margin="normal"
            value={selectEditObj ? selectEditObj.content : ''}
            onChange={(e) => {
              // @ts-ignore
              const { _id } = selectEditObj;
              setSelectEditObj({
                _id,
                content: e.target.value,
              });
            }}
          />
          <Box mt={2} display="flex" justifyContent={'space-around'}>
            <Button onClick={handleEditClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleEdit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};
