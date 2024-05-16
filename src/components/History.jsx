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

export default function History() {

  function createData(name, volume, caffeine, date, id) {
    return { name, volume, caffeine, date, id };
  }

  const [rows, setRows] = useState([]);

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
              <TableCell align="right">Id</TableCell>
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
                <TableCell align="right">{row.date}</TableCell>
                <TableCell align="right">{row.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
}
