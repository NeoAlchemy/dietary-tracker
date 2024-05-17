import * as React from 'react';
import { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function History() {

  function createData(name, volume, caffeine, date, id) {
    const dateFormatted = new Date(date).toLocaleString('en-US', { timeZoneName: 'short' });
    return { name, volume, caffeine, dateFormatted, id };
  }

  const [rows, setRows] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [open, setOpen] = useState(false);

  const handleEditOpen = (row) => {
    setEditRow(row);
    setOpen(true);
  };

  const handleEditClose = () => {
    setOpen(false);
    setEditRow(null);
  };

  const handleSave = () => {
    const updatedRows = rows.map(row => row.id === editRow.id ? editRow : row);
    setRows(updatedRows);
    fetch('/api/historyItem', {
      method: "POST",
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify({ name: editRow.name, volume: editRow.volume, caffeine: editRow.caffeine, unit: "ounces", date: new Date(editRow.dateFormatted), id: editRow.id }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })
    handleEditClose();
  };

  const handleDelete = (id) => {
    const updatedRows = rows.filter(row => row.id !== id);
    fetch('/api/historyItem?id='+id, {
      method: "DELETE",
      headers: {'Content-type': 'application/json'}
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })
    setRows(updatedRows);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditRow({ ...editRow, [name]: value });
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
    const timePart = date.toLocaleTimeString('en-US', { hour12: false }); // Format as HH:MM:SS
    return `${datePart}T${timePart}`;
  };

  useEffect(() => {
    fetch(`/api/historyList`)
      .then(response => response.json())
      .then(data => {
        if (!data.error) { 
          const newRows = data.map(item => createData(item.name, item.volume, item.caffeine, item.date, item.id));
          setRows(newRows);
          
        } else {
          alert(data.error)
        }
      })
      .catch(error => {
        // Handle errors
        alert("error")
        console.error('Error fetching data:', error);
      });
  }, []);

  const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#D98723',
        },
    },
  }); 
  
  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ marginTop: "70px"}}>History</div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Volume</TableCell>
              <TableCell align="right">Caffeine&nbsp;(mg)</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.volume}</TableCell>
                <TableCell align="right">{row.caffeine}</TableCell>
                <TableCell align="right">{row.dateFormatted}</TableCell>
                <TableCell align="right" data-id="{{row.id}}">
                  <Button variant="outlined" size="small" onClick={() => handleEditOpen(row)}>Edit</Button>
                  <Button variant="outlined" size="small" onClick={() => handleDelete(row.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleEditClose}>
        <DialogTitle>Edit Row</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={editRow?.name || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="volume"
            label="Volume"
            type="number"
            fullWidth
            value={editRow?.volume || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="caffeine"
            label="Caffeine (mg)"
            type="number"
            fullWidth
            value={editRow?.caffeine || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="datetime-local"
            fullWidth
            value={editRow ? formatDateForInput(editRow.dateFormatted) : ''}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
