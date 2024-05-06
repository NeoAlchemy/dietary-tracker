import React from 'react';
import AppBar from '@mui/material/AppBar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function App() {

  const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#D98723',
            },
        },
    });
    
  return (
    <Paper sx={{ position: 'fixed', top: 0, left: 0, right: 0 }} elevation={3}>
        <ThemeProvider theme={darkTheme}>
            <AppBar position="static" color="primary">
                <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1, margin: 2 }}>
                    Simple Dietary Tracker
                </Typography>
            </AppBar>
        </ThemeProvider>
    </Paper>
  );
}