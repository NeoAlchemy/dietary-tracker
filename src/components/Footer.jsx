import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';


export default function FixedBottomNavigation() {
  const [value, setValue] = React.useState('recents');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
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
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation  value={value} onChange={handleChange} >
          <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />} to="/dashboard" component={Link} />
          <BottomNavigationAction label="Tracker" icon={<AddCircleIcon />} to="/tracker" component={Link} />
          <BottomNavigationAction label="History" icon={<RestoreIcon />} to="/history" component={Link} />
        </BottomNavigation>
      </Paper>
    </ThemeProvider>
  );
}
